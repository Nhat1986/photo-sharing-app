import { z,createRoute,OpenAPIHono } from '@hono/zod-openapi'
import { getDB } from '../../external/database/db';
import { type ENVS } from '../../environment';
import { constructPublicLink } from './common';

/**
 * This defines the structure of our routes input or body of the request
 */
const getPublicLinkParams = z.object({
  albumId: z.string().min(1).openapi({
      param:{
          in:'path',
          name:'albumId'
      },
      description:'Id of the album you wish to get PublicLink of.'
  })
})


/**
 * Defines the return type the UI should recieve.
 */
const publicLinkResponse = z.object({
  publicLink: z.string()
});

const Response = z.object({
  type: z.string(),
  message: z.string()
})

/**
 * This both defines our routes setup, but also generates the openAPI documentation.
 */
const getPublicLinkRoute = createRoute({
    method:'get',
    path:'/publiclink/{albumId}',
    request: {
      params: getPublicLinkParams,
    },
    responses: {
        200: {
            description:'get group members.',
            content:{
                'application/json':{
                    schema: publicLinkResponse
                }
            }
        },
        404: {
          description:'could not find group',
          content:{
            'application/json':{
              schema: Response
            }
          }
        }
    }
})

export const getPublicLink = new OpenAPIHono<{ Bindings: ENVS }>();

/**
 * This is the actual logic part of our route / feature. 
 */
getPublicLink.openapi(getPublicLinkRoute,async (c) => {
  const db = getDB(c.env.DB);

  const albumId = c.req.param("albumId")

  // Add user to group
  const publicLink = await db.selectFrom('AlbumPublicLinks')
                                .selectAll()
                                .where('Albumid','=',albumId)
                                .executeTakeFirst();

  if(!publicLink || publicLink.enabled == 0 ){
    return c.json({
      type:'ERROR',
      message:'Couldnt find a public link for that album or it is disabled.'
    },404)
  }


  return c.json({
    publicLink:constructPublicLink(publicLink.publicLink)
  },200)
  })