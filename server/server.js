import grpc from 'grpc'
import protoLoader from '@grpc/proto-loader'
import { v4 as uuidv4 } from 'uuid'
import {PROTO_PATH, customers} from './constants.js'

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
})

const customersProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server()
server.addService(customersProto.CustomerService.service, {
    getAll: (_, cb) => {
        cb(null, { customers })
    },

    get: (call, callback) => {
        let customer = customers.find(n => n.id == call.request.id);

        if (customer) {
            callback(null, customer);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },

    insert: (call, callback) => {
        let customer = call.request;
        customer.id = uuidv4();
        customers.push(customer);
        callback(null, customer);
    },

    update: (call, callback) => {
        let existingCustomer = customers.find(n => n.id == call.request.id);

        if (existingCustomer) {
            existingCustomer.name = call.request.name;
            existingCustomer.age = call.request.age;
            existingCustomer.address = call.request.address;
            callback(null, existingCustomer);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },

    remove: (call, callback) => {
        let existingCustomerIndex = customers.findIndex(
            n => n.id == call.request.id
        );

        if (existingCustomerIndex != -1) {
            customers.splice(existingCustomerIndex, 1);
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },
})

server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();