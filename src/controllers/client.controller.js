const Client = require("../models/client");
const { createClientSchema, updateClientSchema } = require('../validation/client.validation');
const { getDecodeToken } = require('../middlewares/decoded');
const db = require('../db/dbconnection');
const message = ("This data is in used, you can't delete it.");

const CreateClient = async (req, res) => {
    const token = getDecodeToken(req)
    try {

        const { error } = createClientSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        let { clientName, status, type } = req.body;

        const companyId = token.decodedToken.companyId;
        const tenantId = token.decodedToken.tenantId;
        const userId = token.decodedToken.userId;

        let client = new Client(tenantId, clientName, status, '', '', '', type);

        client.companyId = companyId;
        client.createdBy = userId;
        client.updatedBy = userId;

        client = await client.save()

        res.status(200).json({
            success: true,
            message: "Client create successfully!",
            record: { client }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
        console.log(error);
    }
};

const ListClient = async (req, res, next) => {
    const token = getDecodeToken(req);
    const companyId = token.decodedToken.companyId;
    const tenantId = token.decodedToken.tenantId;
    try {
        const { q = '', id } = req.query;
        const { type } = req.body;

        if (id) {
            const client = await Client.findById(id);
            if (client[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Client not found' });
            }
        };

        const clientResult = await Client.findAll(tenantId, companyId, type);

        let responseData = {
            success: true,
            message: 'Client List Successfully!',
            data: clientResult[0]
        };

        responseData.data = responseData.data.map(client => {
            const { tenantId, ...rest } = client;
            return rest;
        });

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = clientResult[0].filter(
                client =>
                    client.clientName.toLowerCase().includes(queryLowered) ||
                    (typeof client.status === 'string' && client.status.toLowerCase() === "active" && "active".includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching Client found',
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

const ActiveClient = async (req, res, next) => {
    const token = getDecodeToken(req);
    const companyId = token.decodedToken.companyId;
    const tenantId = token.decodedToken.tenantId;

    try {
        const { q = '', id } = req.query;
        const { type } = req.body;

        if (id) {
            const client = await Client.findById(tenantId, type, id);
            if (client[0].length === 0) {
                return res.status(404).json({ success: false, message: 'Client not found' });
            }
        };

        const clientResult = await Client.findActiveAll(tenantId, companyId, type);

        let responseData = {
            success: true,
            message: 'Client List Successfully!',
            data: clientResult[0]
        };

        responseData.data = responseData.data.map(client => {
            const { tenantId, ...rest } = client;
            return rest;
        });

        if (q) {
            const queryLowered = q.toLowerCase();
            const filteredData = clientResult[0].filter(
                client =>
                    client.clientName.toLowerCase().includes(queryLowered) ||
                    (typeof client.status === 'string' && client.status.toLowerCase() === "active" && "active".includes(queryLowered))
            );

            if (filteredData.length > 0) {
                responseData = {
                    ...responseData,
                    data: filteredData
                };
            } else {
                responseData = {
                    ...responseData,
                    message: 'No matching Client found',
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

const getClientById = async (req, res, next) => {
    const token = getDecodeToken(req);
    const companyId = token.decodedToken.companyId;
    const tenantId = token.decodedToken.tenantId;
    try {
        let Id = req.params.id;
        console.log(Id);
        let [client, _] = await Client.findById(tenantId, companyId, Id)
        console.log(client);

        res.status(200).json({
            success: true,
            message: "Client Record Successfully!",
            data: client
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteClient = async (req, res, next) => {
    const token = getDecodeToken(req);
    const companyId = token.decodedToken.companyId;
    const tenantId = token.decodedToken.tenantId;
    try {
        let clientId = req.params.id;

        const [clientResults] = await db.execute(`SELECT COUNT(*) AS count FROM transaction WHERE clientId = ${clientId}`);

        if (clientResults[0].count > 0) {
            return res.status(200).json({ success: false, message: message });
        };

        await Client.delete(tenantId, companyId, clientId);

        res.status(200).json({
            success: true,
            message: "Account Delete Successfully!"
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const updateClient = async (req, res, next) => {
    const token = getDecodeToken(req);
    const tenantId = token.decodedToken.tenantId;
    const companyId = token.decodedToken.companyId;
    const userId = token.decodedToken.userId;
    try {

        const { error } = updateClientSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        };

        let { clientName, status, type } = req.body;

        let client = new Client(tenantId, clientName, status, '', '', '', type);
        client.companyId = companyId;
        client.updatedBy = userId;

        let Id = req.params.id;
        let [findclient, _] = await Client.findById(tenantId, companyId, Id);
        if (!findclient) {
            throw new Error("Client not found!")
        }
        await client.update(tenantId, companyId, Id)

        res.status(200).json({
            success: true,
            message: "Client Successfully Updated",
            record: { client }, returnOriginal: false, runValidators: true
        });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    CreateClient,
    ListClient,
    ActiveClient,
    getClientById,
    deleteClient,
    updateClient
}