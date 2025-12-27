package tree_sitter_blitz_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-blitz"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_blitz.Language())
	if language == nil {
		t.Errorf("Error loading Blitz grammar")
	}
}
