// eslint-disable-next-line import/prefer-default-export
import uuid from "uuid";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

export const main = async (event, context) => {
  const {title, content, startDate, endDate, attachment} = JSON.parse(event.body)

  const params = {
    TableName: process.env.tableName,
    Item: {
      title,
      content,
      startDate,
      endDate,
      attachment,
      userId: event.requestContext.identity.cognitoIdentityId,
      taskId: uuid.v1(),
      createdAt: Date.now(),
    }
  };

  try{
    const dbData =await dynamoDb.put(params)
    
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item)
    };
  }
  catch(error){
    
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ status: false, error})
    };
  }
};
