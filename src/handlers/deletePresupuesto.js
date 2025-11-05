const { dynamo, TABLE } = require('../utils/dynamoClient');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization'
};


exports.handler = async (event) => {
  try {
    const id = event.pathParameters && event.pathParameters.id;
    if (!id) return { statusCode: 400, headers, body: JSON.stringify({ message: 'Falta id' }) };

    await dynamo.delete({
      TableName: TABLE,
      Key: { id }
    }).promise();

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Eliminado' }) };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error interno', error: err.message })
    };
  }
};
