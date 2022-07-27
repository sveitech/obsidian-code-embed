# Code Embed

Embed an external codefile as a code-block. The codefiles must be located inside
the Obsidian vault.

## Basic Example

Create a code-block with the tag `codefile` and a single line which is a
path to the file to be loaded:

    ```codefile
    path/relative/to/vault/main.cpp
    ```

In the reading view, the file will be loaded from disk and rendered as a
code-block.

## Syntax Highlighting

Prepend the path with a code-language and a `:` to enable language syntax
highlighting:

    ```codefile
    cpp:path/relative/to/vault/main.cpp
    ```
