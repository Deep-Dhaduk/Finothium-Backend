const Company = require("../models/company");
const { createCompanySchema, updateCompanySchema } = require('../validation/company.validation');
const { getDecodeToken } = require('../middlewares/decoded');
const db = require('../db/dbconnection');
const message = ("This data is in used, you can't delete it.");

const CreateCompany = async (req, res) => {
    try {
        const token = getDecodeToken(req);

        const { error } = createCompanySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        let { company_name, legal_name, authorize_person_name, address, contact_no, email, website, pan, gstin, status } = req.body;

        const tenantId = token.decodedToken.tenantId;
        const userId = token.decodedToken.userId;

        let company = new Company(tenantId, company_name, legal_name, authorize_person_name, address, contact_no, email, website, pan, gstin, status);

        company.createdBy = userId;
        company.updatedBy = userId;

        company = await company.save();

        res.status(200).json({
            success: true,
            message: "Company created successfully!",
            record: { company }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const ListCompany = async (req, res, next) => {
    const token = getDecodeToken(req)
    const tenantId = token.decodedToken.tenantId;
    const userId = token.decodedToken.userId;
    try {
        const { q = '', id } = req.query;

        if (id) {
            const company = await Company.findById(tenantId, id);

            if (company[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Company not found' });
            }

            return res.status(200).json({ success: true, message: 'Company found', data: company[0][0] });
        }

        const companyResult = await Company.findAllByUserId(tenantId,userId);
        let responseData = {
            success: true,
            message: 'Company List Successfully!',
            data: companyResult[0]
        };

        responseData.data = responseData.data.map(company => {
            const { tenantId, ...rest } = company;
            return rest;
        })

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = companyResult[0].filter(
                company =>
                    company.company_name.toLowerCase().includes(queryLowered) ||
                    company.legal_name.toLowerCase().includes(queryLowered) ||
                    company.authorize_person_name.toLowerCase().includes(queryLowered) ||
                    company.address.toLowerCase().includes(queryLowered) ||
                    company.pan.toLowerCase().includes(queryLowered) ||
                    (typeof company.status === 'string' && company.status.toLowerCase() === "active" && "active".includes(queryLowered)) ||
                    company.gstin.toString().toLowerCase().includes(queryLowered)
            );
            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching companies found',
                    data: [],
                    total: 0
                };
            }
        }

        res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        next(error);
    }
};

const ActiveCompany = async (req, res, next) => {
    const token = getDecodeToken(req)
    const tenantId = token.decodedToken.tenantId;
    const userId = token.decodedToken.userId

    try {
        const { q = '', id } = req.query;

        if (id) {
            const company = await Company.findById(tenantId, id);

            if (company[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Company not found' });
            }

            return res.status(200).json({ success: true, message: 'Company found', data: company[0][0] });
        }

        const companyResult = await Company.findActiveAll(tenantId);
        let responseData = {
            success: true,
            message: 'Company List Successfully!',
            data: companyResult[0]
        };

        responseData.data = responseData.data.map(company => {
            const { tenantId, ...rest } = company;
            return rest;
        })

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = companyResult[0].filter(
                company =>
                    company.company_name.toLowerCase().includes(queryLowered) ||
                    company.legal_name.toLowerCase().includes(queryLowered) ||
                    company.authorize_person_name.toLowerCase().includes(queryLowered) ||
                    company.address.toLowerCase().includes(queryLowered) ||
                    company.pan.toLowerCase().includes(queryLowered) ||
                    (typeof company.status === 'string' && company.status.toLowerCase() === "active" && "active".includes(queryLowered)) ||
                    company.gstin.toString().toLowerCase().includes(queryLowered)
            );
            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData,
                    total: filteredData.length
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching companies found',
                    data: [],
                    total: 0
                };
            }
        }

        res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        next(error);
    }
};

const getCompanyById = async (req, res, next) => {
    const token = getDecodeToken(req)
    const tenantId = token.decodedToken.tenantId;
    const userId = token.decodedToken.userId
    try {
        let Id = req.params.id;
        let [company, _] = await Company.findById(tenantId, Id);

        res.status(200).json({
            success: true,
            message: "Company Record Successfully!",
            data: company[0]
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteCompany = async (req, res, next) => {
    const token = getDecodeToken(req)
    const tenantId = token.decodedToken.tenantId;
    try {
        let companyId = req.params.id;

        const [accountResults] = await db.execute(`SELECT COUNT(*) AS count FROM company_access WHERE company_id = ${companyId}`);

        if (accountResults[0].count > 0) {
            return res.status(200).json({ success: false, message: message });
        };

        await Company.delete(tenantId, companyId);

        res.status(200).json({
            success: true,
            message: "Common Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const updateCompany = async (req, res, next) => {
    try {
        const token = getDecodeToken(req)
        const tenantId = token.decodedToken.tenantId;
        const userId = token.decodedToken.userId

        const { error } = updateCompanySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { company_name, legal_name, authorize_person_name, address, contact_no, email, website, pan, gstin, status } = req.body;

        let company = new Company(tenantId, company_name, legal_name, authorize_person_name, address, contact_no, email, website, pan, gstin, status)

        company.updatedBy = userId;

        let Id = req.params.id;
        let [findcompany, _] = await Company.findById(tenantId, Id);
        if (!findcompany) {
            throw new Error("Company not found!")
        }
        await company.update(tenantId, Id)
        res.status(200).json({
            success: true,
            message: "Company Successfully Updated",
            record: { company }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

module.exports = {
    CreateCompany,
    ListCompany,
    ActiveCompany,
    getCompanyById,
    deleteCompany,
    updateCompany
}