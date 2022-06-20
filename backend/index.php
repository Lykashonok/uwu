<?php

$codes = [
    "qwer-rewwqfwq-ppfx-weqr",
    "qwsr-rewwqfwq-ppfv-ppfv",
    "qtrr-wwqfwqzc-weqr-weqr",
    "qwyr-rewqqqqq-reww-ppfv",
    "qweg-vavdfvfd-ppfl-pllp"
];
if (in_array($_GET['code'], $codes)) {
    echo "true";
} else {
    http_response_code(404);
    echo "false";
}