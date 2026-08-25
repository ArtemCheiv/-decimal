#### 1.0.0
* 25/08/2026
* Fork by ArtemCheiv
* Throw `Decimal.Error` instead of generic `Error`
* Add `Decimal.from`, `Decimal.tryFrom`, `Decimal.pi`, `Decimal.e`, `Decimal.reset`, `Decimal.version`
* Add instance methods `copy`, `shift`, `isSafeInteger`, `toBigInt`, `toPlainString`
* Fast path for small `BigInt` values
