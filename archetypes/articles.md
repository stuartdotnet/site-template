---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
description: ""            # 120–160 chars — used as the SEO meta description & article-list summary
tags: []
authors: []                # one or more folder names from content/authors/, e.g. ["jane-doe"]
image: ""                  # filename of an image in THIS folder, e.g. "hero.jpg". Leave "" for the placeholder thumbnail.
---

Write your article in Markdown here.

Images live in this same folder — drop the file in beside index.md and
reference it by filename only (no path):

![descriptive alt text](hero.jpg)
