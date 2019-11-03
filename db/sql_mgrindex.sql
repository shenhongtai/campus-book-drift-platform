--订单量统计
select ORD_STATUS, count(ORD_ID) as ORD_COUNT from CBT_ORDER group by ORD_STATUS

--图书按上架类型统计
SELECT BOOK_ISSELL, COUNT(BOOK_ID) as BOOK_COUNT FROM CBT_BOOK b GROUP BY b.book_issell

--七日订单统计
SELECT ORD_TIME, count(*) as ORD_COUNT FROM (
SELECT to_char(o.ord_ordtime, 'mm-dd') as ORD_TIME, o.* FROM CBT_ORDER o WHERE ORD_ORDTIME > to_date('2017-04-05 00:00:00', 'yyyy-mm-dd hh24:mi:ss') order by ORD_ORDTIME
) GROUP BY ORD_TIME

--合作商可计收入统计
SELECT CORP_NAME, trunc(sum(CORP_INCOME), 2) as CORP_INCOME FROM (
SELECT CORP_SHORTNAME as CORP_NAME, (REC_CLICK/REC_PAYBALANCE)*REC_SPPRICE as CORP_INCOME FROM CBT_RECOMMEND INNER JOIN CBT_CORPORATION ON CORP_ID = REC_CORPID WHERE REC_CORPID in ('1', '2', '3')
union
SELECT '其他' as CORP_NAME, (REC_CLICK/REC_PAYBALANCE)*REC_SPPRICE as CORP_INCOME FROM CBT_RECOMMEND INNER JOIN CBT_CORPORATION ON CORP_ID = REC_CORPID WHERE REC_CORPID not in ('1', '2', '3')
) GROUP BY CORP_NAME

--合作商可计收入按金额排序统计
SELECT CORP_NAME, trunc(sum(CORP_INCOME), 2) as CORP_INCOME FROM (
SELECT CORP_SHORTNAME as CORP_NAME, (REC_CLICK/REC_PAYBALANCE)*REC_SPPRICE as CORP_INCOME FROM CBT_RECOMMEND INNER JOIN CBT_CORPORATION ON CORP_ID = REC_CORPID ORDER BY CORP_INCOME desc
) WHERE rownum <= 3 GROUP BY CORP_NAME
union
SELECT CORP_NAME, trunc(sum(CORP_INCOME), 2) as CORP_INCOME FROM (
select a2.* from (select a1.*, rownum rn from (
SELECT '其他' as CORP_NAME, (REC_CLICK/REC_PAYBALANCE)*REC_SPPRICE as CORP_INCOME FROM CBT_RECOMMEND INNER JOIN CBT_CORPORATION ON CORP_ID = REC_CORPID ORDER BY CORP_INCOME desc
) a1) a2 WHERE rn > 3
) GROUP BY CORP_NAME

--首页大字合计
SELECT 'USER' as TOTAL_KEY, COUNT(U_ID) as TOTAL_VAL FROM CBT_USER INNER JOIN CBT_ROLE ON U_ID = R_UID AND R_SIGN = 'U' WHERE U_ID > 10000 UNION SELECT 'BOOK' as TOTAL_KEY, COUNT(BOOK_ID) as TOTAL_VAL FROM CBT_BOOK UNION SELECT 'ORDER' as TOTAL_KEY, COUNT(ORD_ID) as TOTAL_VAL FROM CBT_ORDER UNION SELECT 'INCOME' as TOTAL_KEY, TRUNC(SUM((REC_CLICK/REC_PAYBALANCE)*REC_SPPRICE), 2) as TOTAL_VAL FROM CBT_RECOMMEND
