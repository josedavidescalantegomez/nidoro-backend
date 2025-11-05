const AWS = require('aws-sdk');

const region = process.env.AWS_REGION || 'us-east-1';
AWS.config.update({ region });

const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports = {
  dynamo,
  TABLE: process.env.DYNAMO_TABLE
};
