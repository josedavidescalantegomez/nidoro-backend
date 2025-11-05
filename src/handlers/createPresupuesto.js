const { v4: uuidv4 } = require('uuid');
const { dynamo, TABLE } = require('../utils/dynamoClient');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization'
};


exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');

    // Esperamos: { title, amount, category, month, notes }
    const item = {
      id: uuidv4(),
      title: body.title || 'sin título',
      amount: body.amount || 0,
      category: body.category || 'general',
      month: body.month || (new Date().toISOString().slice(0,7)), // YYYY-MM
      notes: body.notes || '',
      createdAt: new Date().toISOString()
    };

    await dynamo.put({
      TableName: TABLE,
      Item: item
    }).promise();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ message: 'Creado', item })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error interno', error: err.message })
    };
  }
};
