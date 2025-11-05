const { dynamo, TABLE } = require('../utils/dynamoClient');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

exports.handler = async (event) => {
  try {
    const id = event.pathParameters && event.pathParameters.id;
    if (!id) return { statusCode: 400, headers, body: JSON.stringify({ message: 'Falta id' }) };

    const body = JSON.parse(event.body || '{}');

    // Construimos UpdateExpression dinámico
    const allowed = ['title','amount','category','month','notes'];
    let UpdateExpression = 'set';
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
    let prefix = ' ';

    for (const k of allowed) {
      if (body[k] !== undefined) {
        UpdateExpression += `${prefix}#${k} = :${k}`;
        ExpressionAttributeNames[`#${k}`] = k;
        ExpressionAttributeValues[`:${k}`] = body[k];
        prefix = ', ';
      }
    }

    if (UpdateExpression === 'set') {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Nada para actualizar' }) };
    }

    const params = {
      TableName: TABLE,
      Key: { id },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const res = await dynamo.update(params).promise();
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Actualizado', item: res.Attributes }) };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error interno', error: err.message })
    };
  }
};
