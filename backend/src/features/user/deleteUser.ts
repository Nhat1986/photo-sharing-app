import { z,createRoute,OpenAPIHono } from '@hono/zod-openapi'
import { getObjectStorage } from '../../external/objectstorage/types';
import { getDB } from '../../external/database/db';
import { type ENVS } from '../../environment';

/**
 * This defines the structure of our routes input or body of the request
 */
const deleteUserParams = z.object({
    userId: z.string().min(1).openapi({
        param:{
            in:'path',
            name:'userId'
        },
        description:'Id of user you wish to delete.'
    })
})


/**
 * Defines the return type the UI should recieve.
 */
const Response = z.object({
  type: z.string(),
  message: z.string()
})


/**
 * This both defines our routes setup, but also generates the openAPI documentation.
 */
const deleteUserRoute = createRoute({
    method:'delete',
    path:'/user/{userId}',
    request: {
        params:deleteUserParams
    },
    responses: {
        200: {
            description:'delete a user by id.',
            content:{
                'application/json':{
                    schema: Response
                }
            }
        },
        500: {
          description:'failed to delete the image.',
          content:{
            'application/json':{
              schema: Response
            }
          }
        }
    }
})

export const deleteUser = new OpenAPIHono<{ Bindings: ENVS }>();

/**
 * This is the actual logic part of our route / feature. 
 */
deleteUser.openapi(deleteUserRoute,async (c) => {
    const db = getDB(c.env.DB);

    const userId = c.req.param('userId')
  
    try{
        await db.deleteFrom('Users').where('id','=',userId).execute();

    }catch(error){
        return c.json({
            type:"ERROR",
            message:"Failed to delete user."
        },500)
    }

  
    return c.json({
      type:"SUCCESS",
      message:`Successfully deleted user with id: ${userId}`,
    },200)
  })