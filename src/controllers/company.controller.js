const Company = require("../models/company");
const { createCompanySchema, updateCompanySchema } = require('../validation/company.validation');
const { getDecodeToken } = require('../middlewares/decoded');

const CreateCompany = async (req, res) => {
    try {
        const token = getDecodeToken(req);

        const { error } = createCompanySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { company_name, legal_name, authorize_person_name, address, contact_no, email, website, pan, gstin, status, createdBy, updatedBy } = req.body;

        const tenantId = token.decodedToken.tenantId;

        let company = new Company(tenantId, company_name, legal_name, authorize_person_name, address, contact_no, email, website, pan, gstin, status, createdBy, updatedBy);

        company = await company.save();

        res.status(200).json({
            success: true,
            message: "Company create successfully!",
            record: { company }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
        console.log(error);
    }
};

const ListCompany = async (req, res, next) => {
    const token = getDecodeToken(req)
    try {
        const { q = '', id } = req.query;
        const userId = token.decodedToken.userId

        if (id) {
            const company = await Company.findById(id);

            if (company[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Company not found' });
            }

            return res.status(200).json({ success: true, message: 'Company found', data: company[0][0] });
        }

        const companyResult = await Company.findAll(token.decodedToken.tenantId, userId);
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
    try {
        const { q = '', id } = req.query;

        if (id) {
            const company = await Company.findById(id);

            if (company[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Company not found' });
            }

            return res.status(200).json({ success: true, message: 'Company found', data: company[0][0] });
        }

        const companyResult = await Company.findActiveAll(token.decodedToken.tenantId);
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
    try {
        let Id = req.params.id;
        let [company, _] = await Company.findById(Id);

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
    try {
        let Id = req.params.id;
        await Company.delete(Id)
        res.status(200).json({
            success: true,
            message: "Company Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const updateCompany = async (req, res, next) => {
    try {
        const token = getDecodeToken(req);

        const { error } = updateCompanySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { company_name, legal_name, authorize_person_name, address, contact_no, email, website, pan, gstin, status, createdBy, updatedBy } = req.body;

        const tenantId = token.decodedToken.tenantId;

        let company = new Company(tenantId, company_name, legal_name, authorize_person_name, address, contact_no, email, website, pan, gstin, status, createdBy, updatedBy)
        let Id = req.params.id;
        let [findcompany, _] = await Company.findById(Id);
        if (!findcompany) {
            throw new Error("Company not found!")
        }
        await company.update(Id)
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