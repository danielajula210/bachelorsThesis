const RegistrationReducer = (state, action) => {
    switch(action.type){
        case "LOGIN_START":
            return{
                user:null,
                isFetching:true,
                error:false,
            };
        case "LOGIN_SUCCESSFULLY":
            return{
                user:action.payload,
                isFetching:false,
                error:false,
            };   
        case "LOGIN_FAILURE":
            return{
                user:null,
                isFetching:false,
                error:action.payload,
            }; 
        case "FRIEND":
            return{
                ...state,
                user:{
                    ...state.user,
                    friends:[...state.user.friends,action.payload],
                },
            }; 
        case "UNFRIEND":
            return{
                ...state,
                user:{
                    ...state.user,
                    friends: state.user.friends.filter((friends)=>friends!==action.payload),
                },
            }; 
        case "LOGOUT":
            return {
                user: null,
                isFetching: false,
                error: false,
            };
        default:
            return state;
    }
};

export default RegistrationReducer;