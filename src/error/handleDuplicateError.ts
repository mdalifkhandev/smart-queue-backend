/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSource } from "../interface/errorType";

const handleDuplicateError = (err: any) => {
  const match = err.message.match(/"([^"]*)"/);

  const extractedMessage = match && match[1];

  const errorSources: TErrorSource = [
    {
      path: "",
      message: `${extractedMessage} is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Invalid ID",
    errorSources,
  };
};

export default handleDuplicateError;
