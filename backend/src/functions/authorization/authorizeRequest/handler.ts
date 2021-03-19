import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import { verify, decode } from "jsonwebtoken";
import { Jwt } from "@auth/Jwt";
import { JwtPayload } from "@auth/JwtPayload";
import { middyfy } from '@libs/lambda'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJButdqvVNtYnKMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFnJlaXRtYXllci5ldS5hdXRoMC5jb20wHhcNMjEwMjE0MTEwNjE3WhcNMzQx
MDI0MTEwNjE3WjAhMR8wHQYDVQQDExZyZWl0bWF5ZXIuZXUuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw7h/2ESzie5uAnBB+Br8Vbpa
Br80htdDwEaeFPLuOthDFM9GuuKcBrlGrEyDn5GS/9yM4nCiiQFPN+VmhtinchTY
YIYHSNww+p8G3nPon0UTRv3es4ln/nYotP6mo5r4yicnvNopTsoFR0TtgigxHoqa
lq3VJuUfgMygwiW33K/fvo3bTYewArZ+o7OajfYatwQk6fdPVVIJZUMdw/U2sXAf
RMVVn4DBn4ARHIWhRv/xdBaw9sboRTABJFQPC+4OZUmwpJl4xXe4ferQ4Ezc24bU
AaPfPFFGd6/JtuDcv8/e/G9iXkGu02IFlqcYZZtrfXndl1Ds2kiOncAFfWC61QID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTRPU4JY5X+bnz10Yb0
VXaX8aCpqTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAIgOssNC
FyuNghmu835k2n6jIAiKGGwzapMHwJ8HQLK6nNqOTGWr/SSa1+eaN9qJqmpiRrua
k9Vr5iCwIeHWQ/XPqxLvPLcwFksgsYAyuLTsPaYoFajVm5mtLtIkQa4tPJFWKE9w
Vj1X8hZZmXBwIMQQvz96D14RaHOVks32Fv/2XJOyT6EJ5x2rROkAB1W/wL0e+9pz
7QsLPQko1iGSdquBWRybbtvb3eu/PhSn8/Am+J5inRccg1MuEGgN2IpFi3aXtKjy
p4Q8eLLMgI1arKSZuJcMD+RoV3Jqs7owf0CF6PBYes0XiACIdv5TVebC1uyzr/YU
rXrFW9fkCBEFCss=
-----END CERTIFICATE-----`;

export const authorizeRequest = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  console.log(event);
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    console.log(`used is authenticated with token ${jwtToken}`);
    return {
        principalId: 'DUMMY', // jwtToken.sub,
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: '*'
            }
          ]
        }
      } 
  } catch (error) {
    console.error(`User not authorized ${error}`)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
  
};

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);

  const jwt = decode(token, { complete: true }) as Jwt;

  console.log(`processing token ${JSON.stringify(jwt)}`);

  verify(token, cert, { algorithms: ["RS256"] });
  return jwt.payload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error("No authentication header provided");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header. Use Bearer!");

  const split = authHeader.split(" ");
  const token = split[1];
  return token;
}

export const main = middyfy(authorizeRequest);