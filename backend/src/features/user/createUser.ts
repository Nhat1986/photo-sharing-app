import { z,createRoute,OpenAPIHono } from '@hono/zod-openapi'
import { getDB } from '../../external/database/db';
import { SUBSCRIPTIONS, type ENVS } from '../../environment';

/**
 * This defines the structure of our routes input or body of the request
 */
const createUserSchema = z.object({
  id: z.string().openapi({example:'user1'}),
  firstName: z.string().openapi({example:'John'}),
  lastName: z.string().openapi({example:'Doe'}),
  dateOfBirth: z.string().date().openapi({example:"2000-01-07"}),
  email: z.string().email().openapi({example:'john.doe@email.com'}),
  phone:z.string().openapi({example:'0123456789'}),
  profileImage:z.string().url().optional().openapi({example:'example.com/image.jpg'}),
  country:z.string().openapi({example:'australia'}),
  state:z.string().openapi({example:'vic'}),
  }).openapi('UserCreate')


/**
 * Defines the return type the UI should recieve.
 */
const SuccessResponse = z.object({
  type: z.string(),
  message: z.string(),
  userId:z.string(),
})

const ErrorResponse = z.object({
  type: z.string(),
  message: z.string(),
})


/**
 * This both defines our routes setup, but also generates the openAPI documentation.
 */
const createUserRoute = createRoute({
    method:'post',
    path:'/user',
    request: {
      body: {
        content:{
          'application/json':{
            schema:createUserSchema
          }
        }
      }
    },
    responses: {
        201: {
            description:'create a new user object.',
            content:{
                'application/json':{
                    schema: SuccessResponse
                }
            }
        },
        500: {
          description:'failed to create new user.',
          content:{
            'application/json':{
              schema: ErrorResponse
            }
          }
        }
    }
})

export const createUser = new OpenAPIHono<{ Bindings: ENVS }>();

/**
 * This is the actual logic part of our route / feature. 
 */
createUser.openapi(createUserRoute,async (c) => {
    const db = getDB(c.env.DB);

    const body = c.req.valid('json');
  
    try{
      
      await db.insertInto('Users').values({
        id:body.id,
        firstName:body.firstName,
        lastName:body.lastName,
        email:body.email,
        phone:body.phone,
        dateOfBirth:body.dateOfBirth,
        profileImage: body.profileImage || null,
        country:body.country,
        state:body.state,
        subscription: SUBSCRIPTIONS.FREE
      }).execute();


    } catch (e) {
      console.error(e)
      return c.json({
        type:"ERROR",
        message:"Failed to create new user."
      },500)
    }
  
    return c.json({
      type:"SUCCESS",
      message:`successfully created new user with id:${body.id}`,
      userId: body.id
    },201)
  })