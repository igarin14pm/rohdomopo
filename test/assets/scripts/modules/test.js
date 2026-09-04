/**
 * 値が `expect()` 関数を使用して検証されたかどうかを表すグローバル変数  
 * `test()` が呼び出された際に `false` が代入され、 `expect()` が呼び出された際に `true` が代入されます  
 * `test()` は実行終了時に `isExpectCalled` が `false` だった場合はエラーを投げます  
 * @type {boolean}
 */
let isAsserted = false;

/**
 * 初期化処理のコールバック関数です
 * @type {() => void}
 */
let beforeEachCallback;

/**
 * 初期化処理を設定します
 * @param {() => void} callback 初期化処理を記述したコールバック関数
 */
export function beforeEach(callback) {
  beforeEachCallback = callback;
}

/**
 * `expect()` 関数で受け取った値を格納するクラスです
 */
class ReceivedValue {

  /**
   * 検証したい値です
   * @type {any}
   */
  received;

  /**
   * 値を検証するメソッドを呼び出す際、条件に NOT 演算子を付けるかを表します
   * 通常、 `expect()` 関数を介してインスタンス生成されたときは `false` 、 `ReceivedValue.not` を介してインスタンス生成されたときは `true` が代入されます
   * @type {boolean}
   * 
   * @example
   * new ReceivedValue(1, false).toBe(1); // エラーを投げない
   * new ReceivedValue(1, true).toBe(1); // エラーを投げる
   * new ReceivedValue(2, true).toBe(1); // エラーを投げない
   */
  isNegated;

  /**
   * 条件を否定して検証したい場合に呼び出します
   * @type {ReceivedValue}
   * @readonly
   * 
   * @example
   * expect(100).not.toBe(200); // `100` が `200` でないことを検証
   * expect('foo').not.toBeTypeOf('number') // `'foo'` が number 型でないことを検証
   */
  get not() {
    return new ReceivedValue(this.received, true);
  }

  /**
   * `ReceivedValue` のインスタンスを生成します
   * @param {any} value 検証したい値
   * @param {boolean} isNegated 値を検証するメソッドを呼び出す際、条件に NOT 演算子を付けるか `expect()` 関数を介してインスタンスを生成するときは `false` 、 `ReceivedValue.not` を介してインスタンスを生成するときは `true` を代入してください
   */
  constructor(value, isNegated) {
    this.received = value;
    this.isNegated = isNegated;
  }

  /**
   * 条件式が `false` である場合にエラーを投げます
   * @param {boolean} condition 条件式
   * @param {string} errorMessage `isNegated` が `false` 、条件式が `false` である場合のエラーメッセージ
   * @param {string} negatedErrorMessage `isNegated` が `true` 、条件式が `false` である場合のエラーメッセージ
   */
  #assert(condition, errorMessage, negatedErrorMessage) {
    if (this.isNegated) {
      if (condition) {
        throw new Error(negatedErrorMessage);
      }
    } else {
      if (!condition) {
        throw new Error(errorMessage);
      }
    }
  }

  /**
   * `constructor()` で受け取った値と期待される値が等しいかを検証します
   * @param {any} expected 等しいと期待される値
   */
  toBe(expected) {
    isAsserted = true;
    this.#assert(
      this.received === expected, 
      `Expected: ${JSON.stringify(expected)}\nReceived: ${JSON.stringify(this.received)}`,
      `Expected: not ${JSON.stringify(expected)}\nReceived: ${JSON.stringify(this.received)}`
    );
  }

  /**
   * `constructor()` で受け取った値が期待される値より大きいかを検証します
   * @param {any} expected これより大きいと期待される値
   */
  toBeGreaterThan(expected) {
    isAsserted = true;
    this.#assert(
      this.received > expected, 
      `Expected: greater than ${JSON.stringify(expected)}\nReceived: ${JSON.stringify(this.received)}`,
      `Expected: not greater than ${JSON.stringify(expected)}\nReceived: ${JSON.stringify(this.received)}`
    );
  }

  /**
   * `constructor()` で受け取った値が期待される値より小さいかを検証します
   * @param {any} expected これより小さいと期待される値
   */
  toBeLessThan(expected) {
    isAsserted = true;
    this.#assert(
      this.received < expected, 
      `Expected: less than ${JSON.stringify(expected)}\nReceived: ${JSON.stringify(this.received)}`,
      `Expected: not less than ${JSON.stringify(expected)}\nReceived: ${JSON.stringify(this.received)}`
    );
  }

  /**
   * `constructor()` で受け取った値が期待されるプリミティブ型であるかを検証します
   * @param {string} typeName プリミティブ型名
   */
  toBeTypeOf(typeName) {
    isAsserted = true;
    this.#assert(
      typeof this.received === typeName,
      `Expected: type ${typeName}\nReceived: type ${typeof this.received}`,
      `Expected: not type ${typeName}\nReceived: type ${typeof this.received}`
    );
  }

}

/**
 * テストを実行するための関数です
 * @param {string} name テストの名前
 * @param {() => Promise<void> | void} testFn テストを実行する関数
 */
export async function test(name, testFn) {
  isAsserted = false;
  beforeEachCallback();
  try {
    await testFn();
  } catch(error) {
    console.error(`Test failed: ${name}\n${error.message}`);
    return;
  }
  if (!isAsserted) {
    console.error(`Test failed: ${name}\nexpect functions not called.`);
    return;
  }
  beforeEachCallback = () => { };
  console.info(`Test passed: ${name}`);
}

/**
 * `test()` 関数内で検証したい値を受け取る関数です
 * @param {any} value 検証したい値
 * @returns {ReceivedValue} 検証したい値を格納した `ReceivedValue` のインスタンス
 */
export function expect(value) {
  return new ReceivedValue(value, false);
}
