export const messageNotFoundException = {
  statusCode: 404,
  message: "Message not found",
  error: "Not Found"
}
export const userNotFoundException ={
    statusCode: 404,
    message: [
      'Key (userReceiverId)=(3) is not present in table "user"'
    ],
    error: "Not Found"
}