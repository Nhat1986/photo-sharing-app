import { z,createRoute,OpenAPIHono } from '@hono/zod-openapi'
import { getDB } from '../../external/database/db';
import { type ENVS } from '../../environment';

/**
 * This defines the structure of our routes input or body of the request
 */
const updateUserSchema = z.object({
    profileImage: z.string().optional().openapi({example:"https://example.com/image.jpg"}),
  }).openapi('UserUpdate')

const updateUserParams = z.object({
  userId:z.string().min(1).openapi({
    param:{
        in:'path',
        name:'userId'
    },
    description:'Id of user you wish to update.'
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
const updateUserRoute = createRoute({
    method:'patch',
    path:'/user/{userId}',
    request: {
      params:updateUserParams,
      body: {
        content: {
          'multipart/form-data': {
            schema: updateUserSchema
          }
        }
      }
    },
    responses: {
        201: {
            description:'update a user object.',
            content:{
                'application/json':{
                    schema: Response
                }
            }
        },
        500: {
          description:'failed to update user.',
          content:{
            'application/json':{
              schema: Response
            }
          }
        }
    }
})

export const updateUser = new OpenAPIHono<{ Bindings: ENVS }>();

/**
 * This is the actual logic part of our route / feature. 
 */
updateUser.openapi(updateUserRoute,async (c) => {
    const db = getDB(c.env.DB);

    const userId = c.req.param('userId');
    const body = c.req.valid("form");
  
    try{
      // Configure the update query
      var query = db.updateTable('Users').where('id','=',userId)

      // We only update the order value if it's provided.
      if(body.profileImage != undefined) query = query.set({profileImage:body.profileImage})

      // Execute the query
      await query.execute()

    } catch (e) {
      console.error(e)
      return c.json({
        type:"ERROR",
        message:"Failed to update user."
      },500)
    }
  
    return c.json({
      type:"SUCCESS",
      message:`successfully updated user with id:${userId}`,
    },201)
  })