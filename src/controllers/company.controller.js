const Company = require("../models/company");

const CreateCompany = async (req, res, next) => {

    try {
        let { tenantId, company_name, legal_name, authorize_person_name, address, contact_no, email, website, pan, gstin, status, createdBy, updatedBy } = req.body;

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
        next(error);
    }
}

// const ListCompany = async (req, res, next) => {
//     try {
//         const company = await Company.findAll()
//         res.status(200).json({
//             success: true,
//             message: "Company List Successfully!",
//             data: company[0]
//         });
//     } catch (error) {
//         console.log(error);
//         next(error)
//     }
// };

const ListCompany = async (req, res, next) => {
    try {
        const companyResult = await Company.findAll();
        const q = '';
        const queryLowered = q.toLowerCase();

        const filteredData = companyResult.data && companyResult.data.filter(
            company =>
                company.company_name.toLowerCase().includes(queryLowered) ||
                company.legal_name.toLowerCase().includes(queryLowered) ||
                company.authorize_person_name.toLowerCase().includes(queryLowered) ||
                company.gstin.toString().toLowerCase().includes(queryLowered)
        );

        res.status(200).json({
            success: true,
            message: "Company List Successfully!",
            data: companyResult[0]
        });

        if (filteredData) {
            res.status(200).json({
                allData: companyResult.data,
                paymentTransaction: filteredData,
                total: filteredData.length
            });
        }

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
}

const updateCompany = async (req, res, next) => {
    try {
        let { tenantId, company_name, legal_name, authorize_person_name, address, contact_no, email, website, pan, gstin, status, updatedBy } = req.body;
        let company = new Company(tenantId, company_name, legal_name, authorize_person_name, address, contact_no, email, website, pan, gstin, status, updatedBy)
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
}

module.exports = {
    CreateCompany,
    ListCompany,
    getCompanyById,
    deleteCompany,
    updateCompany
}