if (typeof T === 'undefined') require('../setup');

T('extensions', function () {

  function t(actual) {
    T.assert(actual);
  }

  Decimal.config({
    precision: 20,
    rounding: 4,
    toExpNeg: -7,
    toExpPos: 21,
    minE: -9e15,
    maxE: 9e15
  });

  t(Decimal.version === '11.0.0');
  t(typeof Decimal.Error === 'function');

  var x = Decimal.from('123.45');
  t(Decimal.isDecimal(x));
  t(x.eq('123.45'));
  t(x.copy().eq(x));
  t(x.copy() !== x);

  t(Decimal.tryFrom('1.5').eq(1.5));
  t(Decimal.tryFrom({}) === null);
  t(Decimal.tryFrom('not-a-number') === null);

  t(new Decimal(9007199254740991).isSafeInteger());
  t(new Decimal(-9007199254740991).isSafeInteger());
  t(!new Decimal(9007199254740992).isSafeInteger());
  t(!new Decimal('1.5').isSafeInteger());
  t(!new Decimal(NaN).isSafeInteger());
  t(!new Decimal(Infinity).isSafeInteger());

  t(new Decimal('1e-7').toPlainString() === '0.0000001');
  t(new Decimal('-1e-7').toPlainString() === '-0.0000001');
  t(new Decimal('1.23e+21').toPlainString() === '1230000000000000000000');

  t(new Decimal('12.34').shift(2).eq(1234));
  t(new Decimal('12.34').shift(-2).eq('0.1234'));
  t(new Decimal('-5').shift(3).eq(-5000));

  t(Decimal.pi().toSD(5).eq('3.1416'));
  t(Decimal.e().toSD(5).eq('2.7183'));

  if (typeof BigInt !== 'undefined') {
    t(new Decimal(42).toBigInt() === 42n);
    t(new Decimal('-100').toBigInt() === -100n);
    t(new Decimal(0).toBigInt() === 0n);
    t(new Decimal(9999999n).eq(9999999));
    T.assertException(function () { new Decimal('1.5').toBigInt(); });
  }

  T.assertException(function () { new Decimal({}); });
  try {
    new Decimal({});
    t(false);
  } catch (err) {
    t(err instanceof Error);
    t(err instanceof Decimal.Error);
    t(err.name === 'DecimalError');
    t(/DecimalError/.test(err.message));
  }

  var prev = Decimal.precision;
  Decimal.config({ precision: 7 });
  t(Decimal.precision === 7);
  Decimal.reset();
  t(Decimal.precision === 20);
  Decimal.config({ precision: prev });
});
