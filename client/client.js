import grpc from 'grpc'
import protoLoader from '@grpc/proto-loader'

const PROTO_PATH = "../customers.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const CustomerService = grpc.loadPackageDefinition(packageDefinition).CustomerService;
const client = new CustomerService(
    "localhost:30043",
    grpc.credentials.createInsecure()
);

export default client