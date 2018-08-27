// @flow

export type Query = {
  [string]: string
}

export type AsyncActionTypes = {
  START: string,
  SUCCESS: string,
  FAILURE: string
}

export type PureAction = {
  type: string,
  [string]: any
}

export type PromiseAction = {
  types: AsyncActionTypes,
  promise: Promise<any>,
  [string]: any
}

export type Action = PureAction | PromiseAction
