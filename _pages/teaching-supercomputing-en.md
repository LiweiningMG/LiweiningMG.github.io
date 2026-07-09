---
layout: single
title: "Introduction to Supercomputing Platforms"
permalink: /en/teaching/supercomputing-platform-introduction/
lang: en
translation_url: /teaching/2014-spring-teaching-1
author_profile: true
---

# What is a supercomputing platform, and how do we use it?

## 1. Supercomputing platforms and servers

"Supercomputing" refers to high-performance computing systems, or supercomputers, that are used to process large-scale scientific computing tasks. These platforms usually provide strong computing power and are suitable for problems that require substantial computational resources, such as weather simulation, molecular simulation, and genomics analysis.

A supercomputer is still a computer. It has the same basic components as an ordinary computer, but its scale and performance are much higher. A supercomputer is usually made up of many computing nodes. Each node includes a **CPU** (central processing unit, required) and may also include a **GPU** (graphics processing unit, optional). Computing nodes are connected by a high-speed network. The whole system also includes large-scale storage, system software, application software, and cooling systems.

Compared with an ordinary computer, a supercomputer has much larger storage capacity and much faster data processing speed. For this reason, it has become an important tool for solving many large engineering and scientific problems.

## 2. Skills needed for using a supercomputing platform properly

To make good use of a supercomputing platform, it is helpful to understand the following skills and concepts.

### 2.1 Accessing a remote computer

When we use a remote computer to complete our own tasks, we usually do not operate that remote machine face to face. Instead, we interact with it through our own personal computer. Therefore, using a supercomputing platform requires remote access through the network.

You need to understand how to connect to a supercomputer through remote access protocols such as **SSH** (Secure Shell). After logging in, you can edit files, run commands, submit jobs, and manage your analysis tasks.

### 2.2 Basic Linux commands and shell scripting

Most supercomputing platforms run on **Linux**. Therefore, basic Linux commands are essential for file editing, command execution, job submission, and daily workflow management.

Unlike Windows, which provides many graphical user interfaces, interaction with Linux on a server is usually done through the command line. Users who have mainly used Windows may need some time to learn and adapt to this way of working.

### 2.3 Slurm job management system

Supercomputing platforms usually integrate a large amount of hardware and software resources. To use these resources efficiently, the platform needs a dedicated system to manage user jobs. Many supercomputing platforms use **Slurm** to allocate and manage computing resources.

Learning how to submit, monitor, and manage jobs is very important. It helps you use computing nodes effectively and avoid common problems such as occupying resources incorrectly or leaving jobs unmanaged.

### 2.4 Programming skills

For beginners, it may be enough to run software developed by others. However, as the analysis becomes more complex, you may need to modify scripts or write your own scripts and programs.

If you plan to perform scientific computing or data analysis on a supercomputing platform, programming skills are very useful. Languages such as **R**, **Python**, **C/C++**, and **Perl**, together with shell scripting, can help you build efficient and reproducible analysis workflows.

### 2.5 Environment configuration

It is also important to know how to configure your computing environment. This includes installing and managing required software packages and libraries, loading software modules, and setting environment variables.

A well-configured environment can save a lot of time and reduce errors when running computational tasks.

### 2.6 Choosing a suitable high-performance computing platform

Different supercomputing platforms may be suitable for different types of tasks. When choosing a platform, you may need to consider several factors, including the number of nodes, single-node performance, CPU cores, memory, whether GPU nodes are available, storage capacity, cost, stability, and technical support.

<br>

:warning: **Reprint notice**: Thank you for your interest in this article. Please contact the author for permission before reposting. After reposting, please clearly indicate the source and do not claim the article as original.

---

Other public platforms:

**Bilibili**: [房子下面一头猪](https://space.bilibili.com/1521325260)

**Zhihu**: [房子下面一头猪](https://www.zhihu.com/people/mang-guo-c-60-10)