---
layout: single
title: "Bayesian models for multibreed genomic selection considering covariance heterogeneity"
permalink: /en/publication/2023-08-19-conference-1/
lang: en
translation_url: /publication/2023-08-19-conference-1
author_profile: true
---

**Citation**: Li W, Li S, Liu J. Bayesian models for multibreed genomic selection considering covariance heterogeneity. The 22nd National Symposium on Animal Genetics and Breeding, Shanxi, 2023.

[Talk page](https://liweining.cn/en/talks/){: .btn .btn--primary}

## Introduction

Limited population size and the difficulty of recording novel traits can make it challenging to build sufficiently large reference populations for genomic selection. Multibreed joint evaluation is one possible solution, but existing models often ignore differences in genetic covariance among breeds across genomic regions.

## Materials and Methods

This study introduced **mbBayesAS**, a multibreed joint evaluation method that treats the same trait in different breeds as genetically correlated traits. Chromosomes were divided into non-overlapping segments based on linkage disequilibrium information, and marker effects within each segment were modeled with a shared normal distribution. Unknown parameters were estimated using Gibbs sampling.

## Results and Discussion

Simulation and real pig data showed that simply pooling multiple breeds does not necessarily improve prediction accuracy. By fitting different additive genetic covariance matrices across genomic regions, mbBayesAS achieved better prediction performance in scenarios involving hard-to-measure traits and small local-breed populations.