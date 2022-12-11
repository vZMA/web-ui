<template>
	<div class="card">
		<div class="card-content">
			<span class="card-title">Frequently Asked Questions</span>
			<p>
                <p>These are some of the questions we receive from new ARTCC members and visiting controllers regarding traing and first steps:</p>
                <ul>
                    <li><b>I am new to the Miami ARTCC. What do I do?</b>                  
                        <ul>
                            <li>If you are an Observer (OBS), you can begin requesting training through your Controller Dashboard. You will first undergo the 
                            New Student Orientation training and then we will begin on your Clearance Delivery/Ground Control (S1) rating course material.</li>                  
                            <li>If you just transferred to the Miami ARTCC, you need to complete the <a href="https://academy.vatusa.net/course/view.php?id=50" target="_blank">Orientation course</a> and pass the examination. 
                            Once you do that, you need to request a GRP Competency Check through your Controller Dashboard.
                            </li>
                        </ul>
                    </li>
                    <li><b>What will I learn?</b>
                        <ul>
                            <li>
                                Throughout your training, you'll be introduced to many concepts. To learn what you will learn, please view the 
                                appropriate <a href="https://docs.google.com/document/d/1CS8ivM2lUssXd2bm_Z9Ex5OGJNqMpTqOU9hpAPWbjro/edit?usp=sharing" target="_blank">Training Program</a> document.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <b>How do I request training?</b>
                        <ul>
                            <li>
                                You can request training through your Controller Dashboard on the Miami ARTCC website. You access the Controller Dashboard 
                                by logging in, clicking your name (on the upper right-hand side of the page), and clicking Controller Dashboard. You then go to Training Sessions and then 
                                click Request to add your availability. Remember, this time is in UTC/Zulu time.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <b>How do I see my Training Records?</b>
                        <ul>
                            <li>You can see your Training Records by going to the Training Sessions portion of your Controller Dashboard and clicking the Training Session you wish to review.</li>
                            <li>As an alternative, you can view your Training Records by visiting the VATUSA website, logging in, and then clicking My VATUSA, profile, and then clicking the Training Record tab.</li>
                        </ul>
                    </li>
                    <li><b>I need training help!</b>
                        <ul>
                            <li>
                            If you need help with your training or if you have an Air Traffic Control question, please email the Training Team at <a href="mailto:training@zmaartcc.net">training@zmaartcc.net</a>.
                            </li>
                        </ul>
                    </li>
                </ul>
            </p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'TrainingFAQ',
	title: 'Frequently Asked Questions'
};
</script>

<style lang="scss" scoped>
.card-content {
	p + p {
		margin-top: 1.5em;
	}
}
img {
	max-width: 100%;
}
</style>