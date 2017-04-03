package Perfomance.exam.code001;

/**
 * Created by Administrator on 2017/03/31.
 */
public class ReplaceAllTest {
    public static void main(String[] args) {
        String source = "test replace test replace test replace test replace test replace test replace test replace test";
        String target = "replace";
        String replace = "______";

        long start = System.nanoTime();
        System.out.println(source.replaceAll(target, replace));
        System.out.println("걸린시간 A: " + (System.nanoTime() - start));

        start = System.nanoTime();
        System.out.println(replaceAllCustom(source, target, replace));
        System.out.println("걸린시간 B: " + (System.nanoTime() - start));
    }

    public static String replaceAllCustom(String source, String target, String replace) {
        int sp = 0;
        int inx = source.indexOf(target);

        // 변할 값이 없으면 source를 반환한다.
        if(inx < 0) {
            return source;
        }

        int length = target.length();
        StringBuilder sb = new StringBuilder();

        while(inx >= 0) {
            sb.append(source.substring(sp, inx)).append(replace);
            sp = inx + length;
            inx = source.indexOf(target, sp);
        }

        if(sp < source.length()) {
            sb.append(source.substring(sp));
        }

        return sb.toString();
    }
}
