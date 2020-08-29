########################### DO NOT MODIFY THIS SECTION ##########################
#################################################################################
import sqlite3
from sqlite3 import Error
import csv
#################################################################################

## Change to False to disable Sample
SHOW = True

############### SAMPLE CLASS AND SQL QUERY ###########################
######################################################################
class Sample():
    def sample(self):
        try:
            connection = sqlite3.connect("sample")
            connection.text_factory = str
        except Error as e:
            print("Error occurred: " + str(e))
        print('\033[32m' + "Sample: " + '\033[m')
        
        # Sample Drop table
        connection.execute("DROP TABLE IF EXISTS sample;")
        # Sample Create
        connection.execute("CREATE TABLE sample(id integer, name text);")
        # Sample Insert
        connection.execute("INSERT INTO sample VALUES (?,?)",("1","test_name"))
        connection.commit()
        # Sample Select
        cursor = connection.execute("SELECT * FROM sample;")
        print(cursor.fetchall())

######################################################################

class HW2_sql():
    ############### DO NOT MODIFY THIS SECTION ###########################
    ######################################################################
    def create_connection(self, path):
        connection = None
        try:
            connection = sqlite3.connect(path)
            connection.text_factory = str
        except Error as e:
            print("Error occurred: " + str(e))
    
        return connection

    def execute_query(self, connection, query):
        cursor = connection.cursor()
        try:
            if query == "":
                return "Query Blank"
            else:
                cursor.execute(query)
                connection.commit()
                return "Query executed successfully"
        except Error as e:
            return "Error occurred: " + str(e)
    ######################################################################
    ######################################################################

    # GTusername [0 points]
    def GTusername(self):
        gt_username = "psrinivasan48"
        return gt_username
    
    # Part a.i Create Tables [2 points]
    def part_ai_1(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_ai_1_sql = "CREATE TABLE MOVIES(ID INTEGER, TITLE TEXT, SCORE REAL);"
        ######################################################################
        
        return self.execute_query(connection, part_ai_1_sql)

    def part_ai_2(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_ai_2_sql = "CREATE TABLE MOVIE_CAST(MOVIE_ID INTEGER, CAST_ID INTEGER, CAST_NAME TEXT, BIRTHDAY TEXT, POPULARITY REAL);"
        ######################################################################
        
        return self.execute_query(connection, part_ai_2_sql)
    
    # Part a.ii Import Data [2 points]
    def part_aii_1(self,connection,path):
        ############### CREATE IMPORT CODE BELOW ############################
        insert_sql = "INSERT INTO MOVIES VALUES(?, ?, ?)"
        try:
            csv_file = open(path)
            rows = csv.reader(csv_file, delimiter = ',')
            for row in rows:
                connection.execute(insert_sql, row)
        except:
            csv_file = open(path, encoding = "utf-8")
            rows = csv.reader(csv_file, delimiter = ',')
            for row in rows:
                connection.execute(insert_sql, row)

       ######################################################################
        
        sql = "SELECT COUNT(id) FROM movies;"
        cursor = connection.execute(sql)
        return cursor.fetchall()[0][0]
    
    def part_aii_2(self,connection, path):
        ############### CREATE IMPORT CODE BELOW ############################
        insert_sql = "INSERT INTO MOVIE_CAST VALUES(?, ?, ?, ?, ?)"
        try:
            csv_file = open(path)
            rows = csv.reader(csv_file, delimiter = ',')
            for row in rows:
                connection.execute(insert_sql, row)
        except:
            csv_file = open(path, encoding = "utf-8")
            rows = csv.reader(csv_file, delimiter = ',')
            for row in rows:
                connection.execute(insert_sql, row)
        ######################################################################
        
        sql = "SELECT COUNT(cast_id) FROM movie_cast;"
        cursor = connection.execute(sql)
        return cursor.fetchall()[0][0]

    # Part a.iii Vertical Database Partitioning [5 points]
    def part_aiii(self,connection):
        ############### EDIT CREATE TABLE SQL STATEMENT ###################################
        part_aiii_sql = "CREATE TABLE CAST_BIO(CAST_ID INTEGER, CAST_NAME TEXT, BIRTHDAY TEXT, POPULARITY REAL); "
        ######################################################################
        
        self.execute_query(connection, part_aiii_sql)
        
        ############### CREATE IMPORT CODE BELOW ############################
        part_aiii_insert_sql = "INSERT INTO CAST_BIO SELECT DISTINCT CAST_ID, CAST_NAME, BIRTHDAY, POPULARITY FROM MOVIE_CAST"
        ######################################################################
        
        self.execute_query(connection, part_aiii_insert_sql)
        
        sql = "SELECT COUNT(cast_id) FROM cast_bio;"
        cursor = connection.execute(sql)
        return cursor.fetchall()[0][0]
       

    # Part b Create Indexes [1 points]
    def part_b_1(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_b_1_sql = "CREATE INDEX MOVIE_INDEX ON MOVIES(ID)"
        ######################################################################
        return self.execute_query(connection, part_b_1_sql)
    
    def part_b_2(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_b_2_sql = "CREATE INDEX CAST_INDEX ON MOVIE_CAST(CAST_ID)"
        ######################################################################
        return self.execute_query(connection, part_b_2_sql)
    
    def part_b_3(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_b_3_sql = "CREATE INDEX CAST_BIO_INDEX ON CAST_BIO(CAST_ID)"
        ######################################################################
        return self.execute_query(connection, part_b_3_sql)
    
    # Part c Calculate a Proportion [3 points]
    def part_c(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_c_sql = "SELECT  printf('%.2f', c1*1.0/c2 * 100) FROM (SELECT COUNT(1) AS c1 FROM MOVIES WHERE SCORE>50 AND lower(TITLE) LIKE '%war%') AS T1, (SELECT COUNT(1) AS c2 FROM MOVIES);"
        ######################################################################
        cursor = connection.execute(part_c_sql)
        return cursor.fetchall()[0][0]

    # Part d Find the Most Prolific Actors [4 points]
    def part_d(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_d_sql = "SELECT CAST_NAME, COUNT(CAST_NAME) CT FROM MOVIE_CAST GROUP BY CAST_NAME HAVING POPULARITY>10 ORDER BY CT DESC LIMIT 5"
        ######################################################################
        cursor = connection.execute(part_d_sql)
        return cursor.fetchall()

    # Part e Find the Highest Scoring Movies With the Least Amount of Cast [4 points]
    def part_e(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_e_sql = "SELECT TITLE, printf('%.2f', SCORE), COUNT(CAST_ID) AS CT FROM MOVIE_CAST A JOIN MOVIES B ON A.MOVIE_ID=B.ID GROUP BY TITLE ORDER BY SCORE DESC, CT ASC LIMIT 5"

        ######################################################################
        cursor = connection.execute(part_e_sql)
        return cursor.fetchall()
    
    # Part f Get High Scoring Actors [4 points]
    def part_f(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_f_sql = """
SELECT CAST_ID, CAST_NAME, AVERAGE_SCORE FROM (SELECT CAST_ID, CAST_NAME, COUNT(MOVIE_ID) CT, 
printf('%.2f', avg(SCORE)) AS AVERAGE_SCORE FROM 
(SELECT * FROM MOVIES WHERE SCORE >= 25) MV JOIN MOVIE_CAST MC ON MV.ID=MC.MOVIE_ID 
GROUP BY CAST_ID HAVING CT > 2 ORDER BY AVERAGE_SCORE DESC, CAST_NAME ASC LIMIT 10)
        """
        ######################################################################
        cursor = connection.execute(part_f_sql)
        return cursor.fetchall()

    # Part g Creating Views [6 points]
    def part_g(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_g_sql = "CREATE VIEW GOOD_COLLABORATION AS  "\
                        "SELECT A.CAST_ID CAST_MEMBER_ID1, B.CAST_ID CAST_MEMBER_ID2, COUNT(1)" \
                        " AS MOVIE_COUNT, AVG(C.SCORE) AVERAGE_MOVIE_SCORE FROM "\
                        "(SELECT CAST_ID, MOVIE_ID FROM MOVIE_CAST) A JOIN "\
                        "(SELECT CAST_ID, MOVIE_ID FROM MOVIE_CAST) B JOIN "\
                        "(SELECT ID, SCORE FROM MOVIES ) C "\
                        "ON A.MOVIE_ID = B.MOVIE_ID AND A.MOVIE_ID = C.ID AND A.CAST_ID < B.CAST_ID " \
                        "GROUP BY A.CAST_ID, B.CAST_ID HAVING AVERAGE_MOVIE_SCORE >=40 AND MOVIE_COUNT >= 3"
        ######################################################################
        return self.execute_query(connection, part_g_sql)
    
    def part_gi(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_g_i_sql = """SELECT CAST_ID, CAST_NAME, 
        printf('%.2f', AVG(AVERAGE_MOVIE_SCORE)) AS COLLABORATION_SCORE FROM 
        (SELECT CAST_MEMBER_ID1 AS CAST_ID, CAST_NAME, AVERAGE_MOVIE_SCORE FROM 
        GOOD_COLLABORATION E
        JOIN CAST_BIO F ON E.CAST_MEMBER_ID1=F.CAST_ID 
        UNION 
        SELECT CAST_MEMBER_ID2 AS CAST_ID, CAST_NAME, AVERAGE_MOVIE_SCORE FROM 
        GOOD_COLLABORATION G 
        JOIN CAST_BIO B ON G.CAST_MEMBER_ID2=B.CAST_ID) 
        GROUP BY CAST_ID ORDER BY COLLABORATION_SCORE DESC, CAST_NAME ASC LIMIT 5
        """
        ######################################################################
        cursor = connection.execute(part_g_i_sql)
        return cursor.fetchall()
    
    # Part h FTS [4 points]
    def part_h(self,connection,path):
        ############### EDIT SQL STATEMENT ###################################
        part_h_sql = "CREATE VIRTUAL TABLE MOVIE_OVERVIEW USING FTS3(ID INTEGER, OVERVIEW TEXT)"
        ######################################################################
        connection.execute(part_h_sql)
        ############### CREATE IMPORT CODE BELOW ############################
        insert_sql = "INSERT INTO MOVIE_OVERVIEW VALUES(?, ?)"
        try:
            csv_file = open(path)
            rows = csv.reader(csv_file, delimiter = ',')
            for row in rows:
                connection.execute(insert_sql, row)
        except:
            csv_file = open(path, encoding = "utf-8")
            rows = csv.reader(csv_file, delimiter = ',')
            for row in rows:
                connection.execute(insert_sql, row)
        ######################################################################
        sql = "SELECT COUNT(id) FROM movie_overview;"
        cursor = connection.execute(sql)
        return cursor.fetchall()[0][0]
        
    def part_hi(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_hi_sql = """
SELECT COUNT(DISTINCT ID) FROM MOVIE_OVERVIEW WHERE OVERVIEW MATCH 'fight'
        """
        ######################################################################
        cursor = connection.execute(part_hi_sql)
        return cursor.fetchall()[0][0]
    
    def part_hii(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_hii_sql = "SELECT COUNT(DISTINCT ID) FROM MOVIE_OVERVIEW WHERE OVERVIEW MATCH 'space NEAR/5 program'"
        ######################################################################
        cursor = connection.execute(part_hii_sql)
        return cursor.fetchall()[0][0]


if __name__ == "__main__":
    
    ########################### DO NOT MODIFY THIS SECTION ##########################
    #################################################################################
    if SHOW == True:
        sample = Sample()
        sample.sample()

    print('\033[32m' + "Q2 Output: " + '\033[m')
    db = HW2_sql()
    try:
        conn = db.create_connection("Q2")
    except:
        print("Database Creation Error")

    try:
        conn.execute("DROP TABLE IF EXISTS movies;")
        conn.execute("DROP TABLE IF EXISTS movie_cast;")
        conn.execute("DROP TABLE IF EXISTS cast_bio;")
        conn.execute("DROP VIEW IF EXISTS good_collaboration;")
        conn.execute("DROP TABLE IF EXISTS movie_overview;")
    except:
        print("Error in Table Drops")

    try:
        print('\033[32m' + "part ai 1: " + '\033[m' + str(db.part_ai_1(conn)))
        print('\033[32m' + "part ai 2: " + '\033[m' + str(db.part_ai_2(conn)))
    except:
         print("Error in Part a.i")

    try:
        print('\033[32m' + "Row count for Movies Table: " + '\033[m' + str(db.part_aii_1(conn,"data/movies.csv")))
        print('\033[32m' + "Row count for Movie Cast Table: " + '\033[m' + str(db.part_aii_2(conn,"data/movie_cast.csv")))
    except Exception as e:
        print("Error in part a.ii", e)

    try:
        print('\033[32m' + "Row count for Cast Bio Table: " + '\033[m' + str(db.part_aiii(conn)))
    except:
        print("Error in part a.iii")

    try:
        print('\033[32m' + "part b 1: " + '\033[m' + db.part_b_1(conn))
        print('\033[32m' + "part b 2: " + '\033[m' + db.part_b_2(conn))
        print('\033[32m' + "part b 3: " + '\033[m' + db.part_b_3(conn))
    except:
        print("Error in part b")

    try:
        print('\033[32m' + "part c: " + '\033[m' + str(db.part_c(conn)))
    except Exception as e:
        print("Error in part c", e)

    try:
        print('\033[32m' + "part d: " + '\033[m')
        for line in db.part_d(conn):
            print(line[0],line[1])
    except Exception as e:
        print("Error in part d", e)

    try:
        print('\033[32m' + "part e: " + '\033[m')
        for line in db.part_e(conn):
            print(line[0],line[1],line[2])
    except Exception as e:
        print("Error in part e", e)

    try:
        print('\033[32m' + "part f: " + '\033[m')
        for line in db.part_f(conn):
            print(line[0],line[1],line[2])
    except Exception as e:
        print("Error in part f", e)
    
    try:
        print('\033[32m' + "part g: " + '\033[m' + str(db.part_g(conn)))
        print('\033[32m' + "part g.i: " + '\033[m')
        for line in db.part_gi(conn):
            print(line[0],line[1],line[2])
    except Exception as e:
        print("Error in part g", e)

    try:   
        print('\033[32m' + "part h.i: " + '\033[m'+ str(db.part_h(conn,"data/movie_overview.csv")))
        print('\033[32m' + "Count h.ii: " + '\033[m' + str(db.part_hi(conn)))
        print('\033[32m' + "Count h.iii: " + '\033[m' + str(db.part_hii(conn)))
    except Exception as  e:
        print("Error in part h", e)

    conn.close()
    #################################################################################
    #################################################################################
  
