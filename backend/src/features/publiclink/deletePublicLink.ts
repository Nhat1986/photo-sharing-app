import { z,createRoute,OpenAPIHono } from '@hono/zod-openapi'
import { getDB } from '../../external/database/db';
import { type ENVS } from '../../environment';

/**
 * This defines the structure of our routes input or body of the request
 */
const deletePublicLinkParams = z.object({
  albumId: z.string().min(1).openapi({
      param:{
          in:'path',
          name:'albumId'
      },
      description:'Id of the album you wish to delete the public link from.'
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
const deletePublicLinkRoute = createRoute({
    method:'delete',
    path:'/publiclink/{albumId}',
    request: {
      params: deletePublicLinkParams,
    },
    responses: {
        200: {
            description:'delete public link',
            content:{
                'application/json':{
                    schema: Response
                }
            }
        }
    }
})

export const deletePublicLink = new OpenAPIHono<{ Bindings: ENVS }>();

/**
 * This is the actual logic part of our route / feature. 
 */
deletePublicLink.openapi(deletePublicLinkRoute,async (c) => {
  const db = getDB(c.env.DB);

  const albumId = c.req.param("albumId")

  await db.deleteFrom('AlbumPublicLinks')
          .where('Albumid','=',albumId)
          .execute();

  
  return c.json({
    type:'SUCCESS',
    message:`Successfully deleted public link from album.`
  },200)
  })