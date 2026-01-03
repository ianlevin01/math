import { dynamo } from "../utils/dynamoClient.js";
import {
  PutCommand,
  GetCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "Users";

export async function createUser(user) {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: user,
    ConditionExpression: "attribute_not_exists(email)"
  });

  return dynamo.send(command);
}

export async function getUserByEmail(email) {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { email }
  });

  const result = await dynamo.send(command);
  return result.Item;
}

export async function incrementRequests(email) {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { email },
    UpdateExpression: "SET requestsCount = requestsCount + :inc",
    ExpressionAttributeValues: {
      ":inc": 1
    }
  });

  return dynamo.send(command);
}
