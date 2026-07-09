---
title: Multi-Trait Bayesian Models Enhance the Accuracy of Genomic Prediction in Multi-Breed Reference Populations
collection: publications
category: manuscripts
permalink: /publication/2024-04-16-Agriculture
excerpt: '提出了一个多品种联合基因组预测模型mbBayesAB，该模型将不同品种的相同性状视为可能具有遗传相关的不同性状，并将染色体划分为不同区块以拟合异质遗传(协)方差，从而提高基因组育种值预测准确性。'
date: 2024-04-16
venue: 'Agriculture'
slidesurl: 'https://liweining.cn/files/Agriculture_2024-04-16_manuscript.pdf'
paperurl: 'https://doi.org/10.3390/agriculture14040626'
citation: 'Weining Li, Meilin Zhang, Heng Du, Jianliang Wu, Lei Zhou and Jianfeng Liu，Multi-Trait Bayesian Models Enhance the Accuracy of Genomic Prediction in Multi-Breed Reference Populations，Agriculture，2024，14(4)：626'
---

[全文链接](https://doi.org/10.3390/agriculture14040626){: .btn .btn--primary} [PDF](https://liweining.cn/files/Agriculture_2024-04-16_manuscript.pdf){: .btn}

## 背景

对多个品种进行联合基因组预测（MBGP）以扩大参考规模是一种有前景的策略，可以改善对单个品种有限种群规模或表型记录的预测。然而，如果不同品种的遗传背景和标记效应结构存在差异，简单合并多个品种并不一定能带来稳定提升。

## 方法

本研究提出了一种 MBGP 模型 **mbBayesAB**。该模型将不同品种的相同性状视为潜在的遗传相关但不同的性状，并将染色体划分为独立区块，以拟合异质遗传（协）方差。研究还分析了 mbBayesAB 中随机效应（协）方差矩阵先验的最佳实践，并将该模型与品种内基因组预测（WBGP）以及其他常用 MBGP 模型进行比较。

## 结果

结果表明，在随机效应先验中分配逆 Wishart 分布，并从表型中获得逆 Wishart 先验的尺度信息，可以使 mbBayesAB 获得较高预测准确性。当联合使用两个牛品种（利木赞和安格斯）时，mbBayesAB 在两个体重性状上的准确性均高于 WBGP 模型。对于猪的大理石纹评分性状，与 WBGP 相比，使用 mbBayesAB 的多品种联合预测使约克郡验证群体的准确性提高了 6.27%。

## 结论

在多品种基因组预测中考虑异质遗传（协）方差是有益的，但合理设定（协）方差和超参数先验对于模型性能至关重要。