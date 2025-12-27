{
  "target_defaults": {
    "include_dirs": [
      "<!(node -e \"require('node-addon-api').include\")"
    ],
    "defines": [ "NAPI_VERSION=<(napi_build_version)" ],
    "cflags_c": [
      "-std=c11"
    ]
  },
  "targets": [{
    "target_name": "tree_sitter_blitz_binding",
    "dependencies": [
      "<!(node -p \"require('node-addon-api').targets\"):node_addon_api_except"
    ],
    "sources": [
      "bindings/node/binding.cc",
      "src/parser.c"
    ],
    "cflags_c": [
      "-std=c11"
    ]
  }]
}
