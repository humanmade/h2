import updateObject from './updateObject'

/**
 * Update a user via the api.
 *
 * @param  Object user The user object.
 */
export default function updateUser( user  ) {
	return updateObject( user, 'USERS_USER' )
}
