import psycopg2

from config import CONNECT_DATA


def get_robots():
    connect = psycopg2.connect(**CONNECT_DATA)
    spark_ip = {}
    try:
        with connect as con:
            with con.cursor() as cur:
                query = f"SELECT name, ip_address FROM robots WHERE active = 2;"
                cur.execute(query)
                if cur.rowcount:
                    data = cur.fetchall()
                    for row in data:
                        spark_ip[row[0]] = row[1]
    except Exception as err:
        print(f"{type(err):\n{err}.}")
    finally:
        if connect:
            connect.close()
    return spark_ip
