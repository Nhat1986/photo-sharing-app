import { z,createRoute,OpenAPIHono } from '@hono/zod-openapi'
import { getDB } from '../../external/database/db';
import { ROLES, type ENVS } from '../../environment';

/**
 * This defines the structure of our routes input or body of the request
 */
const updatePublicLinkSchema = z.object({
    enabled:z.boolean()
  }).openapi('PublicLinkUpdate')

const updatePublicLinkParams = z.object({
  albumId: z.string().min(1).openapi({
      param:{
          in:'path',
          name:'albumId'
      },
      description:'Id of the album you wish to update a member of.'
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
const updatePublicLinkRoute = createRoute({
    method:'patch',
    path:'/publiclink/{albumId}',
    request: {
      params: updatePublicLinkParams,
      body: {
        content: {
          'multipart/form-data': {
            schema: updatePublicLinkSchema
          }
        }
      }
    },
    responses: {
        201: {
            description:'update a public links status.',
            content:{
                'application/json':{
                    schema: Response
                }
            }
        }
    }
})

export const updatePublicLink = new OpenAPIHono<{ Bindings: ENVS }>();

/**
 * This is the actual logic part of our route / feature. 
 */
updatePublicLink.openapi(updatePublicLinkRoute,async (c) => {
  const db = getDB(c.env.DB);

  const albumId = c.req.param("albumId")
  const body = c.req.valid("form");

  await db.updateTable('AlbumPublicLinks')
          .set({
            enabled: body.enabled ? 1 : 0
          })
          .where('Albumid','=',albumId)
          .execute();

  return c.json({
    type:"SUCCESS",
    message:`Successfully updated album public link.`,
  },201)
  })