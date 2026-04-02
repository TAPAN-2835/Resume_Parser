/**
 * Resume Parser State Machine
 * Ensures valid state transitions and prevents invalid states
 */

export enum UIState {
  EMPTY = 'EMPTY',
  UPLOADING = 'UPLOADING',
  PARSING = 'PARSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type StateTransition = {
  [key in UIState]: UIState[];
};

// Define valid state transitions
const validTransitions: StateTransition = {
  [UIState.EMPTY]: [UIState.UPLOADING],
  [UIState.UPLOADING]: [UIState.PARSING, UIState.ERROR],
  [UIState.PARSING]: [UIState.SUCCESS, UIState.ERROR],
  [UIState.SUCCESS]: [UIState.EMPTY, UIState.UPLOADING],
  [UIState.ERROR]: [UIState.EMPTY, UIState.UPLOADING],
};

export interface StateMachineState {
  current: UIState;
  previous?: UIState;
  transitionedAt: Date;
}

export interface StateEvent {
  type: 'UPLOAD' | 'PARSE' | 'SUCCESS' | 'ERROR' | 'RESET';
  payload?: Record<string, unknown>;
}

/**
 * Validates if a transition from one state to another is allowed
 */
export const canTransition = (from: UIState, to: UIState): boolean => {
  return validTransitions[from].includes(to);
};

/**
 * Gets all valid next states from current state
 */
export const getValidNextStates = (currentState: UIState): UIState[] => {
  return validTransitions[currentState];
};

/**
 * State machine reducer for use with useReducer
 */
export const stateMachineReducer = (
  state: StateMachineState,
  action: StateEvent
): StateMachineState => {
  let nextState: UIState | null = null;

  switch (action.type) {
    case 'UPLOAD':
      nextState = UIState.UPLOADING;
      break;
    case 'PARSE':
      nextState = UIState.PARSING;
      break;
    case 'SUCCESS':
      nextState = UIState.SUCCESS;
      break;
    case 'ERROR':
      nextState = UIState.ERROR;
      break;
    case 'RESET':
      nextState = UIState.EMPTY;
      break;
    default:
      return state;
  }

  // Validate transition
  if (!canTransition(state.current, nextState)) {
    console.warn(
      `[State Machine] Invalid transition: ${state.current} → ${nextState}`
    );
    return state;
  }

  return {
    current: nextState,
    previous: state.current,
    transitionedAt: new Date(),
  };
};

/**
 * Initialize state machine
 */
export const initializeState = (): StateMachineState => ({
  current: UIState.EMPTY,
  transitionedAt: new Date(),
});
