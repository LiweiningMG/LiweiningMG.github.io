---
title: "超级计算平台简介"
collection: teaching
type: "超算平台系列"
permalink: /teaching/2014-spring-teaching-1
venue: "中国农业大学"
date: 2023-09-27
location: "北京"
---

# 超级计算平台是什么？怎么用？

## 1. 超级计算平台（服务器）

“**超算**”全称“**超级计算**”(super computing) 或者“**超级计算机**”(super computer)，用于处理**大规模**和**高性能**的科学计算任务。这些平台通常拥有强大的计算能力，适用于处理需要**大量计算资源**的问题，如气象模拟、分子模拟、**基因组学**分析等。

超级计算机也是**计算机**，拥有**普通计算机**的**所有部件**，但超级计算机的**规模**和**性能**要比普通计算机强很多个数量级。超级计算机由大量的**计算节点**组成，每个计算节点由 **CPU** (中央处理器，必需) 和 **GPU** (图形处理单元，**非必需**) 组成，计算节点之间由**高速互联网络**连接。此外，整个系统还包括大规模**存储系统**、**系统软件**、**应用软件**和**冷却系统**等。与普通计算机相比，超级计算机具有极大的数据**存储容量**和极快速的数据**处理速度**，因此超级计算机成为解决重大工程时难以取代的工具。

## 2. 合理使用超算需掌握的技能

为了充分利用超级计算平台，你需要掌握以下一些关键技能和知识

### 2.1 访问远程计算机（超算）

由于我们在使远程计算机完成自己任务的时候，使用者通常都不可能直接在远程计算机上**面对面**操作，而是通过自己的**个人计算机**和远程计算机进行**交互**完成作业。所以，使用超级计算平台需要通过网络远程访问计算资源。你需要了解如何通过**SSH（Secure Shell）**等**远程访问**协议连接到超级计算机，以便进行**文件编辑**、**命令执行**和**作业提交**等。

### 2.2 Linux基本命令和Shell脚本编写

超级计算平台通常运行在**Linux**操作系统上，因此你需要熟悉基本的Linux命令，以便你完成上述提到的**文件编辑**、**命令执行**和**作业提交**等操作。与Windows系统拥有丰富的**用户交互界面**不同，我们与Linux系统进行交互的方式通常以**命令行**的形式进行，所以对于长时间只使用Windows终端的用户可能需要一定的时间学习和适应。

### 2.3 作业管理系统Slurm

超级计算平台通常有庞大的软硬件资源集成，为了计算资源得到更充分的利用，所以需要专门的软件对用户的**作业**进行**管理**。目前众多的超算平台上基本都使用**Slurm**作业管理系统来分配和管理计算资源。了解如何**提交**、**监控**和**管理**作业非常重要，以便充分利用计算节点。

### 2.4 编程技能

作为初学者，我们可能只需要应用别人开发的软件，但随着分析的深入我们不免需要修改脚本甚至是自行编写脚本或程序以完成自己的作业。所以如果你需要在超级计算平台上进行科学计算或数据分析，编程技能是不可或缺的。掌握编程语言（如**R**、**Python**、**C/C++**、**Perl**等）和脚本编写可以帮助你开发**高效**的计算代码。

### 2.5 环境配置

了解如何配置计算环境，包括**安装**和**管理**所需的**软件包**和**库**，以及设置**环境变量**，对于顺利完成计算任务至关重要。

### 2.6 高算平台选择

不同的超级计算平台可能适用于不同类型的任务。需要综合考虑**节点数**、**单节点性能**（核心和内存）、是否有**GPU**节点、**存储大小**、**成本**、**稳定性**及**售后支持**等因素

<br>  

:warning: **转载声明**：感谢您对文章内容的认可，转载请联系作者获得授权，转载后请在醒目位置标明来源，且禁止声明原创。  

---  
  
其他公众平台：  
  
**Bilibili**：[房子下面一头猪](https://space.bilibili.com/1521325260) 
  
**知乎**：[房子下面一头猪](https://www.zhihu.com/people/mang-guo-c-60-10)
