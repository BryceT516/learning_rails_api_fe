import React from 'react';
import './App.css';
import ListsContainer from './containers/ListsContainer';


const UserContext = React.createContext();
const MeetupContext = React.createContext();


const initialState = {
  meetup: {
    title: 'Auth0 Online Meetup',
    date: Date(),
    attendees: ['Bob', 'Jessy', 'Christina', 'Adam']
  },
  user: {
    name: 'Roy'
  }
};


const reducer = (state, action) => {
  switch(action.type) {
    case 'subscribeUser':
      return {
        ...state,
        attendees: [...state.attendees, action.payload],
        subscribed: true
      };
    case 'unSubscribeUser':
      return {
        ...state,
        attendees: state.attendees.filter(
          attendee => attendee !== action.payload
        ),
        subscribed: false
      };
    default:
      return state;
  }
};


const MeetupContextProvider = ({ user, ...props}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState.meetup);
  return (
    <MeetupContext.Provider
      value={{
        ...state,
        handleSubscribe: () =>
          dispatch({ type: 'subscribeUser', payload: user.name }),
        handleUnSubscribe: () =>
          dispatch({ type: 'unSubscribeUser', payload: user.name })
      }}
    >
      {props.children}
    </MeetupContext.Provider>
  );
};


const App = () => (
  <UserContext.Provider value={initialState.user}>
      <UserContext.Consumer>
        {user => (
          <MeetupContextProvider user={user}>
            <MeetupContext.Consumer>
              {meetup => (
                <div>
                  <div className="App">
                    <header className="App-header">
                      <h1 className="App-title">Hello Hiplyst!</h1>
                    </header>
                    
                    <ListsContainer />
                  </div>
                  <h1>{meetup.title}</h1>
                  <span>{meetup.date}</span>
                  <div>
                    <h2>{`Attendees (${meetup.attendees.length})`}</h2>
                    {meetup.attendees.map((attendant, index) => (
                      <li key={index}>{attendant}</li>
                    ))}
                    <p>
                      {!meetup.subscribed ? (
                        <button onClick={meetup.handleSubscribe}>
                          Subscribe
                        </button>
                      ) : (
                        <button onClick={meetup.handleUnSubscribe}>
                          Unsubscribe
                        </button>
                      )}
                    </p>
                    
                  </div>
                </div>
              )}
            </MeetupContext.Consumer>
          </MeetupContextProvider>
        )}
      </UserContext.Consumer>
    </UserContext.Provider>
  );

export default App;
