// chatRepository.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "sa-east-1" });
const ddb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Chats";

export async function createChat({ email, chatId, title }) {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      PK: `USER#${email}`,
      SK: `CHAT#${chatId}`,
      chatId,
      title,
      createdAt: new Date().toISOString(),
    },
  });

  await ddb.send(command);
}

export async function addMessage({ chatId, role, content, index }) {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      PK: `CHAT#${chatId}`,
      SK: `MSG#${String(index).padStart(6, "0")}`,
      role,
      content,
      createdAt: new Date().toISOString(),
    },
  });

  await ddb.send(command);
}

export async function getUserChats(email) {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": `USER#${email}`,
      ":sk": "CHAT#",
    },
  });

  const { Items } = await ddb.send(command);
  return Items;
}

export async function getChatMessages(chatId) {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": `CHAT#${chatId}`,
      ":sk": "MSG#",
    },
  });

  const { Items } = await ddb.send(command);
  return Items;
}
