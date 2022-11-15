const LOAD_WATCHLISTS = "watchlists/loadWatchlists"
const LOAD_SINGLEWATCHLIST = "waatchlists/loadSingleWatchlist"
const CREATE_WATCHLIST = "watchlists/createWatchlist"
const UPDATE_WATCHLIST = "watchlists/updateWatchlist"
const DELETE_WATCHLIST = "watchlists/deleteWatchlists"

const loadWatchlists = (watchlists) => {
    console.log('this is watchlists>>', watchlists)
    return {
        type: LOAD_WATCHLISTS,
        watchlists
    }
}

const loadSingleWatchlist = (watchlist) => {
    return {
        type: LOAD_SINGLEWATCHLIST,
        watchlist
    }
}

const createNewWatchlist = (watchlist) => {
    return {
        type: CREATE_WATCHLIST,
        watchlist
    }
}

const deleteWatchlist = (watchlistId) => {
    return {
        type: DELETE_WATCHLIST,
        watchlistId
    }
}

// const updateWatchlist = (watchlist) => {
//     return {
//         type: UPDATE_WATCHLIST,
//         watchlist
//     }
// }


// ================= Thunk ==================
export const getAllWatchlists = (userId) => async (dispatch) => {
    // =============  not sure about path ==============
    const res = await fetch(`/users/${userId}/watchlists`)
    const data = await res.json()
    if (res.ok) {
        dispatch(loadWatchlists(data))
    }
}

export const getSingleWatchlist = (id) => async (dispatch) => {
    const res = await fetch(`/watchlists/${id}`)
    const data = await res.json()
    if (res.ok) {
        dispatch(loadSingleWatchlist(data))
    }
}

// -------------- Create new watchlist ---------------------
export const createWatchlist = (watchlist, userId) => async (dispatch) => {
    const res = await fetch(`/users/${userId}/watchlists`, {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(watchlist)
    })
    if ( res.ok ){
        const newWatchlist = await res.json()
        dispatch(createNewWatchlist(newWatchlist,userId))
        return newWatchlist
    }
}

// //------------- Update watchlist -----------------
// export const updateCurrWatchlist = (watchlist) => async (dispatch) => {
//     const res = await fetch(`/users/watchlists`)
// }


//  ------------- Delete Watchlist ---------------
export const deleteSingleList = (watchlistId) => async (dispatch) => {
    const res = await fetch(`/watchlists/${watchlistId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        await dispatch(deleteWatchlist(watchlistId))
        return res
    }
}


const initialState = { allWatchlists: {}, singleWatchlist: {} }
const watchlistsReducer = (state = initialState, action) => {
    let newState = {};
    switch (action.type) {
        case LOAD_WATCHLISTS:
            newState = { ...state, allWatchlists: {}, singleWatchlist: {} }
            Object.values(action.watchlists).map(watchlist => (
                newState.allWatchlists[watchlist.id] = { ...watchlist }
            ))
            return newState

        case LOAD_SINGLEWATCHLIST:
            newState = { allWatchlists: {}, singleWatchlist: {} }
            newState.singleWatchlist = action.watchlist
            return newState

        case CREATE_WATCHLIST:
            return {
                ...state,
                allWatchlists: {
                    ...state.allWatchlists,
                    ...action.watchlist
                },
                singleWatchlist: {}
            }

        case DELETE_WATCHLIST:
            newState = {
                singleWatchlist: {},
                allWatchlists: { ...state.allWatchlists }
            }
            delete newState.allWatchlists[action.watchlistId]
            return newState

        default:
            return state
    }
}

export default watchlistsReducer;
