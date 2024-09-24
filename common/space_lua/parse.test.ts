import { parse } from "$common/space_lua/parse.ts";
import { assertEquals } from "@std/assert/equals";

Deno.test("Test Lua parser", () => {
    // Basic block test
    parse(`
        print("Hello, World!")
        print(10)
`);
    parse("");
    // Expression tests
    parse(
        `e(1, 1.2, -3.8, +4, #lst, true, false, nil, "string", "Hello there \x00", ...)`,
    );

    parse(`e(10 << 10, 10 >> 10, 10 & 10, 10 | 10, 10 ~ 10)`);

    assertEquals(
        parse(`e(1 + 2 - 3 * 4 / 4)`),
        parse(`e(1 + 2 - ((3 * 4) / 4))`),
    );
    parse(`e(true and false or true)`);
    parse(`e(a < 3 and b > 4 or b == 5 or c <= 6 and d >= 7 or a /= 8)`);
    parse(`e(a.b.c)`);
    parse(`e((1+2))`);

    // Table expressions
    parse(`e({})`);
    parse(`e({1, 2, 3, })`);
    parse(`e({1 ; 2 ; 3})`);
    parse(`e({a = 1, b = 2, c = 3})`);
    parse(`e({[3] = 1, [10 * 10] = "sup"})`);

    // Function calls
    parse(`e(func(), func(1, 2, 3), a.b(), a.b.c:hello(), (a.b)(7))`);

    // Function expression
    parse(`e(function(a, b) test() end)`);
    parse(`e(function(a, b, ...) end)`);

    // Statements
    parse(`do end`);
    parse(`do print() end`);
    parse(`::hello::
    goto hello`);
    parse(`while true do print() end`);
    parse(`repeat print() until false`);
    parse(
        `if 1 == 2 then print() elseif 1 < 2 then print2() else print3() end`,
    );
    parse(`if true then print() end`);
    parse(`if true then print() else print2() end`);
    parse(`if true then print() elseif false then print2() end`);

    // For loops
    parse(`for i = 1, 10, 1 do print(i) end`);
    parse(`for i = 1, 10 do print(i) end`);
    parse(`for el in each({1, 2, 3}) do print(i) end`);
    parse(`for i, l in 1, pairs() do print(i) end`);

    // Function statements
    parse(`function a() end`);
    parse(`function a:b() end`);
    parse(`function a.b.c:d() end`);
    parse(`function a.b.c() end`);
    parse(`function hello(a, b) end`);
    parse(`function hello(a, b, ...) end`);
    parse(`local function hello() end`);

    // Assignments, local variables etc.
    parse(`a = 1`);
    parse(`a, b = 1, 2`);
    parse(`a.b.c = 1`);
    parse(`a["name"] = 1`);
    parse(`local a, b<const>`);
    parse(`local a = 1`);
    parse(`local a<const> = 4`);
    parse(`local a, b = 1, 2`);

    // Function calls
    parse(`a(1, 2, 3)`);
    parse(`print "Sup"`);
    parse(`e(1 + print "8")`);
});
