const { dynamo, TABLE } = require('../utils/dynamoClient');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

exports.handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const { category, month } = qs;

    if (category) {
      // Usar GSI CategoryIndex
      const params = {
        TableName: TABLE,
        IndexName: 'CategoryIndex',
        KeyConditionExpression: 'category = :c',
        ExpressionAttributeValues: {
          ':c': category
        }
      };

      const res = await dynamo.query(params).promise();
      let items = res.Items || [];
      if (month) items = items.filter(i => i.month === month);
      return { statusCode: 200, headers, body: JSON.stringify(items) };
    }

    // Si no category, scan (pequeña DB ok, si grande usar filtros o paginación)
    let params = { TableName: TABLE };
    if (month) {
      params = {
        ...params,
        FilterExpression: '#m = :month',
        ExpressionAttributeNames: { '#m': 'month' },
        ExpressionAttributeValues: { ':month': month }
      };
    }

    const res = await dynamo.scan(params).promise();
    return { statusCode: 200, headers, body: JSON.stringify(res.Items || []) };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error interno', error: err.message })
    };
  }
};
