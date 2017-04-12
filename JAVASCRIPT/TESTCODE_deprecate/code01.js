/**
 * Created by mgram on 2017-04-12.
 */


/*
value     | !value | !!value
-----------+--------+-------
false     | true   | false
true      | false  | true
null      | true   | false
undefined | true   | false
0         | true   | false
1         | false  | true
-5        | false  | true
NaN       | true   | false
''        | true   | false
'hello'   | false  | true
*/

var abc;

console.log(!!abc);