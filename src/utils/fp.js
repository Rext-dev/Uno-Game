export class Either {
  constructor(isRight, value) {
    this._isRight = isRight;
    this._value = value;
  }

  map(f) {
    return this._isRight ? Either.right(f(this._value)) : this;
  }

  chain(f) {
    return this._isRight ? f(this._value) : this;
  }

  ap(ef) {
    if (!this._isRight) return this;
    if (!ef._isRight) return ef;
    return Either.right(ef._value(this._value));
  }

  fold(onLeft, onRight) {
    return this._isRight ? onRight(this._value) : onLeft(this._value);
  }

  bimap(fl, fr) {
    return this._isRight
      ? Either.right(fr(this._value))
      : Either.left(fl(this._value));
  }

  isRight() {
    return this._isRight;
  }

  isLeft() {
    return !this._isRight;
  }

  value() {
    return this._value;
  }

  static right(r) {
    return new Either(true, r);
  }

  static left(l) {
    return new Either(false, l);
  }

  static of(r) {
    return Either.right(r);
  }

  static fromNullable(v, onNull) {
    return v == null ? Either.left(onNull()) : Either.right(v);
  }

  static tryCatch(thunk) {
    try {
      return Either.right(thunk());
    } catch (err) {
      return Either.left(/** @type {any} */ (err));
    }
  }
}

export const eitherFromValidation = (result) => {
  if (!result.error) return Either.right(result.value);
  const errors = (result.error.details || []).map((d) => ({
    field: Array.isArray(d.path) ? d.path.join(".") : String(d.path ?? ""),
    message: d.message,
    value: d.context?.value,
  }));
  return Either.left(errors);
};

export const validateWithJoi = (schema, data, options = {}) => {
  const res = schema.validate(data, options);
  return eitherFromValidation(res);
};
