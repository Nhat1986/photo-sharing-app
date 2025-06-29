import { z,createRoute,OpenAPIHono } from '@hono/zod-openapi'
import { getDB } from '../../external/database/db';
import { ROLES, type ENVS } from '../../environment';
import { getNewId } from '../../external/ids/getId';
import { constructPublicLink } from './common';

/**
 * This defines the structure of our routes input or body of the request
 */
const createPublicLinkParams = z.object({
  albumId: z.string().min(1).openapi({
      param:{
          in:'path',
          name:'albumId'
      },
      description:'Id of the album you wish to make public.'
  })
})

/**
 * Defines the return type the UI should recieve.
 */
const Response = z.object({
  type: z.string(),
  message: z.string(),
  publicLink: z.string(),
})

const ErrorResponse = z.object({
  type: z.string(),
  message: z.string(),
})


/**
 * This both defines our routes setup, but also generates the openAPI documentation.
 */
const createPublicLinkRoute = createRoute({
    method:'post',
    path:'/publiclink/{albumId}',
    request: {
      params: createPublicLinkParams,
    },
    responses: {
        201: {
            description:'add new public link.',
            content:{
                'application/json':{
                    schema: Response
                }
            }
        },
        409: {
          description:'failed to create public link. May already exist.',
          content:{
            'application/json':{
              schema: ErrorResponse
            }
          }
        }
    }
})

export const createPublicLink = new OpenAPIHono<{ Bindings: ENVS }>();

/**
 * This is the actual logic part of our route / feature. 
 */
createPublicLink.openapi(createPublicLinkRoute,async (c) => {
  const db = getDB(c.env.DB);

  const albumId = c.req.param("albumId")

  //TODO: Add env for domain.
  const publicLinkId = getNewId();


  try {
    // We only store the ID & construct the link live - this allows us to easily change this process with only a code change.
    await db.insertInto('AlbumPublicLinks')
            .values({
              Albumid:albumId,
              publicLink:publicLinkId,
              enabled:1
    }).execute();

  } catch(error){
    return c.json({
      type:"ERROR",
      message:`Failed to create public link for album.`,
    },409)
  }
  
  return c.json({
    type:"SUCCESS",
    message:`Sucessfully created public link for album.`,
    publicLink:constructPublicLink(publicLinkId)
  },201)
  })