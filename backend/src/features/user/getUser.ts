import { z,createRoute,OpenAPIHono } from '@hono/zod-openapi'
import { getObjectStorage } from '../../external/objectstorage/types';
import { ENVS } from '../../environment';
import { getDB } from '../../external/database/db';


const getUserParams = z.object({
    userId: z.string().min(1).openapi({
        param:{
            in:'path',
            name:'userId'
        },
        description:'Id of user you wish to fetch.'
    })
})

const UserType = z.object({
    country: z.string(),
    createdAt: z.string().nullish(),
    dateOfBirth: z.string(),
    email: z.string(),
    firstName: z.string(),
    id: z.string(),
    lastName: z.string(),
    phone: z.string().nullish(),
    profileImage: z.string().nullish(),
    state: z.string(),
    subscription: z.string(),
})

const SuccessResponse = z.object({
    type: z.string(),
    message: z.string(),
    user:UserType
  })

const ErrorResponse = z.object({
    type: z.string(),
    message: z.string()
  })

/**
 * This both defines our routes setup, but also generates the openAPI documentation.
 */
const getUserRoute = createRoute({
    method:'get',
    path:'/user/{userId}',
    request: {
        params: getUserParams
    },
    responses: {
        200: {
            description:'Fetch an image object.',
            content:{
                'application/json':{
                    schema: SuccessResponse
                }
            }
        },
        404: {
            description: 'Image could not be found in bucket.',
            content:{
                'application/json':{
                    schema:ErrorResponse
                }
            }
        }
    }
})

export const getUser = new OpenAPIHono<{ Bindings: ENVS }>();

/**
 * This is the actual logic part of our route / feature. 
 */
getUser.openapi(getUserRoute,async (c) => {
    const db = getDB(c.env.DB);
    const userId = c.req.param('userId');
  
    try{

        const user = await db.selectFrom('Users')
                            .selectAll()
                            .where('id','=',userId)
                            .executeTakeFirst();

        if(!user) throw new Error(`Unable to find user with id:${userId}`)

        return c.json({
            type:"SUCCESS",
            message:"Successfully found user.",
            user:user
            },200);

    } catch (e) {
        console.error(e)
        return c.json({
          type:"ERROR",
          message:"Failed to find user."
        },404);
    }
  })