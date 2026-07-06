-- Neon 后台查询用：访问地区统计不会暴露在网站页面或公开 API 中。

-- 总览
SELECT
  COUNT(DISTINCT visitor_hash) AS 历史访问人数,
  COUNT(DISTINCT visitor_hash) FILTER (WHERE visit_date = CURRENT_DATE) AS 今日访问人数
FROM site_visits;

-- 按地区统计
SELECT
  region AS 访问地区,
  COUNT(DISTINCT visitor_hash) FILTER (WHERE visit_date = CURRENT_DATE) AS 今日访问人数,
  COUNT(DISTINCT visitor_hash) AS 历史访问人数
FROM site_visits
GROUP BY region
ORDER BY 今日访问人数 DESC, 历史访问人数 DESC, 访问地区 ASC;