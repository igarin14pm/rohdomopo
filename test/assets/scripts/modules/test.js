/**
 * 値が `expect()` 関数を使用して検証されたかどうかを表すグローバル変数  
 * `test()` が呼び出された際に `false` が代入され、 `expect()` が呼び出された際に `true` が代入されます  
 * `test()` は実行終了時に `isExpectCalled` が `false` だった場合はエラーを投げます  
 * @type {boolean}
 */
let isAsserted = false;

/**
 * `expect()` 関数で受け取った値を格納するクラスです
 */
class ReceivedValue {

  /**
   * `ReceivedValue` のインスタンスを生成します
   * @param {any} value 検証したい値
   */
  constructor(value) {
    this.received = value;
  }

  /**
   * コンストラクタで受け取った値と期待される値が等しいかを検証します
   * @param {any} expected 期待される値
   */
  toBe(expected) {
    isAsserted = true;
    if (this.received !== expected) {
      throw new Error(`Expected ${JSON.stringify(expected)}, but received ${JSON.stringify(this.received)}`);
    }
  }

}

/**
 * テストを実行するための関数です
 * @param {string} name テストの名前
 * @param {() => void} testFn テストを実行する関数
 */
export function test(name, testFn) {
  isAsserted = false;
  try {
    testFn();
  } catch(error) {
    console.error(`Test failed: ${name}\n${error.message}`);
    return;
  }
  if (!isAsserted) {
    console.error(`Test failed: ${name}\nexpect functions not called.`);
    return;
  }
  console.info(`Test passed: ${name}`);
}

/**
 * `test()` 関数内で検証したい値を受け取る関数です
 * @param {any} value 検証したい値
 * @returns {ReceivedValue} 検証したい値を格納した `ReceivedValue` のインスタンス
 */
export function expect(value) {
  return new ReceivedValue(value);
}
