/**
 *  @openapi
 *  /auth/getAccount:
 *  get:
 *      tags:
 *      - Account
 *      description: Showcase all account
 *      responses:
 *          200:
 *              description: App is up and running
 */
/**
 *  @openapi
 *  /auth/getToken:
 *  get:
 *      tags:
 *      - Account
 *      description: Responds if the app is up and running
 *      responses:
 *          200:
 *              description: App is up and running
 */
/**
 *  @openapi
 *  /auth/refreshToken:
 *  post:
 *      tags:
 *      - Token
 *      description: Responds if the app is up and running
 *      responses:
 *          200:
 *              description: App is up and running
 */
/**
 *  @openapi
 *  /auth/refreshToken:
 *  post:
 *      tags:
 *      - Token
 *      summary: Get new Access Token
 *      description: Responds if the app is up and running
 *      requestBody:
 *          required: true
 *          contents:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/createNewAccessToken'
 *      responses:
 *          200:
 *              description: App is up and running
 *              content:
 *                application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/createNewAccessToken'
 *          400:
 *              description: Bad Request
 */
