package Perfomance.exam.code002;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by Administrator on 2017/03/31.
 */
public class DateTextTest {
    public static void main(String[] args) {
        String date = null;
        long start = System.nanoTime();
        for(int i=0; i< 1000000; i++) {
            SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd HH:mm:ss");
            date = format.format(new Date());
        }
        System.out.println("걸린시간 A: " + (System.nanoTime() - start));

        start = System.nanoTime();
        SimpleDateFormat format = new SimpleDateFormat();
        for(int i=0; i< 1000000; i++) {
            format.applyPattern("yyyyMMdd HH:mm:ss");
            date = format.format(new Date());
        }
        System.out.println("걸린시간 B: " + (System.nanoTime() - start));
    }
}
